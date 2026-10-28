import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import * as mapData from "./routeMapData.js";

const require = createRequire(import.meta.url);
const { transformSync } = require("@babel/core");
const sourceRoot = new URL("../../", import.meta.url);

function harness(file, overrides = {}) {
  const slots = [];
  let cursor = 0;
  let effects = [];
  const React = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    forwardRef: component => component,
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
      return [slots[index], value => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(effect, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || deps.some((dep, i) => !Object.is(dep, previous.deps[i]))) {
        previous?.cleanup?.();
        const entry = { deps };
        slots[index] = entry;
        effects.push(() => { entry.cleanup = effect(); });
      }
    },
    useCallback: callback => callback,
    useImperativeHandle: () => {},
  };
  const common = {
    react: React,
    "react-native": {
      View: "View", Text: "Text", Pressable: "Pressable", ActivityIndicator: "ActivityIndicator",
      StyleSheet: { create: value => value, absoluteFill: {}, absoluteFillObject: {} },
    },
    "react-native-maps": { __esModule: true, default: "MapView", Marker: "Marker", Polyline: "Polyline" },
    "@expo/vector-icons": { FontAwesome5: "Icon", Ionicons: "Icon" },
    "react-native-safe-area-context": { useSafeAreaInsets: () => ({ top: 24, bottom: 0 }) },
    "react-i18next": { useTranslation: () => ({ t: key => key }) },
    "@react-navigation/native": { useNavigation: () => ({ navigate() {} }), useIsFocused: () => true },
    "@core/services/ThemeService": { useTheme: () => ({ theme: {} }) },
    "@core/hooks/useWindow": () => ({ width: 360 }),
    "@core/config/roles/roleConfig": { roleConfig: {
      student: { topBar: {}, card: {} }, driver: { topBar: {}, card: {} },
      parent: { topBar: {}, card: {} }, admin: { topBar: {}, card: {} },
    } },
    "@core/services/authService": { getSession: async () => ({ profileId: "profile" }) },
    "@core/services/tripApi": { getTripStatusApi: async () => null },
    "@core/services/notificationApi": {},
    "@core/services/apiClient": {},
    "@features/gps/routeMapData": mapData,
    "@features/gps/hooks/useGpsTracking": () => ({
      location: null, error: "GPS unavailable", fallbackLocation: { latitude: 2.9, longitude: -75.2 },
    }),
    ...overrides,
  };
  const compiled = transformSync(readFileSync(new URL(file, sourceRoot), "utf8"), {
    babelrc: false, configFile: false,
    plugins: ["@babel/plugin-transform-react-jsx", "@babel/plugin-transform-modules-commonjs"],
  }).code;
  const module = { exports: {} };
  runInNewContext(compiled, {
    module, exports: module.exports, console: { error() {}, warn() {} },
    setInterval: () => 1, clearInterval() {}, setTimeout: () => 1, clearTimeout() {},
    require(specifier) {
      if (specifier in common) return common[specifier];
      if (specifier.startsWith("@components/") || specifier.endsWith(".style") ||
          specifier === "@features/gps/components/GpsMap" ||
          specifier === "@features/home/components/RouteMap") return specifier;
      throw new Error("Unmocked import: " + specifier);
    },
  });
  return {
    render(props = {}) {
      cursor = 0;
      effects = [];
      let tree = module.exports.default(props);
      while (typeof tree.type === "function") tree = tree.type(tree.props);
      const pending = effects;
      effects = [];
      pending.forEach(effect => effect());
      return tree;
    },
  };
}

function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...(tree.props?.children ?? []).flat(Infinity).flatMap(nodes)];
}

const route = { id: "route", name: "School route", stops: [
  { id: "stop", name: "School", address: "School street", latitude: 2.9, longitude: -75.2, orderSequence: 1 },
] };
const settle = () => new Promise(resolve => setImmediate(resolve));

for (const role of ["student", "parent", "driver", "admin"]) {
  for (const [file, mapType, stopsProp] of [
    ["features/home/views/MainPage/MainPage.jsx", "@features/home/components/RouteMap", "stops"],
    ["features/gps/views/LiveTracking/LiveTracking.jsx", "@features/gps/components/GpsMap", "routeStops"],
  ]) {
    test(`${file}: ${role} renders route stops without bus GPS or completed road geometry`, async () => {
      const view = harness(file, {
        "@core/hooks/useSession": () => ({ role, initialized: true }),
        "@core/services/visibleRouteService": { resolveRouteForRole: async actualRole => {
          assert.equal(actualRole, role);
          return { route, note: null };
        } },
        "@core/services/routeApi": { getRouteSuggestionApi: () => new Promise(() => {}) },
      });
      view.render();
      await settle();
      const map = nodes(view.render()).find(node => node.type === mapType);
      assert.equal(map.props[stopsProp].length, 1);
      assert.equal(map.props[stopsProp][0].name, "School");
      assert.equal(map.props[stopsProp][0].address, "School street");
    });
  }
}

for (const file of ["features/home/components/RouteMap.jsx", "features/gps/components/GpsMap.jsx"]) {
  test(`${file}: renders native stop markers with no vehicle position`, () => {
    const stops = mapData.normalizeStops(route);
    const view = harness(file);
    const tree = view.render({ stops, routeStops: stops, routeGeometry: [] });
    const markers = nodes(tree).filter(node => node.type === "Marker");
    assert.equal(markers.length, 1);
    assert.match(markers[0].props.title, /School/);
    assert.equal(markers[0].props.description, "School street");
    assert.equal(markers[0].props.coordinate.latitude, 2.9);
  });

  test(`${file}: frames one or multiple stops after native map readiness`, () => {
    for (const count of [1, 2]) {
      const stops = mapData.normalizeStops({ stops: Array.from({ length: count }, (_, index) => ({
        id: index, latitude: 2.9 + index, longitude: -75.2,
      })) });
      const calls = [];
      const view = harness(file);
      const props = { stops, routeStops: stops, routeGeometry: [] };
      const tree = view.render(props);
      tree.props.ref.current = {
        animateToRegion: region => calls.push({ region }),
        fitToCoordinates: coordinates => calls.push({ coordinates }),
      };
      tree.props.onMapReady();
      assert.equal(calls.length, 1);
      if (count === 1) assert.equal(calls[0].region.latitude, stops[0].latitude);
      else assert.equal(calls[0].coordinates.length, 2);
      view.render({ ...props, location: { latitude: 10, longitude: 10 } });
      assert.equal(calls.length, 1, "GPS updates must not move the stops out of view");
    }
  });
}

test("LiveTracking does not request routes until session initialization completes", async () => {
  let initialized = false;
  let calls = 0;
  const view = harness("features/gps/views/LiveTracking/LiveTracking.jsx", {
    "@core/hooks/useSession": () => ({ role: "student", initialized }),
    "@core/services/visibleRouteService": { resolveRouteForRole: async () => {
      calls++;
      return { route, note: null };
    } },
    "@core/services/routeApi": { getRouteSuggestionApi: async () => { throw new Error("OSRM offline"); } },
  });
  view.render();
  await settle();
  assert.equal(calls, 0);
  initialized = true;
  view.render();
  await settle();
  const tree = view.render();
  assert.equal(calls, 1);
  assert.equal(nodes(tree).find(n => n.type === "@features/gps/components/GpsMap").props.routeStops.length, 1);
  assert.ok(nodes(tree).some(n => n.type === "Text" && n.props.children.some(c =>
    typeof c === "string" && c.includes("Se muestran las paradas"))));
});

test("MainPage keeps a visible loading state and delays route requests until session initialization", async () => {
  let initialized = false;
  let calls = 0;
  const view = harness("features/home/views/MainPage/MainPage.jsx", {
    "@core/hooks/useSession": () => ({ role: "student", initialized }),
    "@core/services/visibleRouteService": { resolveRouteForRole: async () => {
      calls++;
      return { route, note: null };
    } },
  });
  const loading = nodes(view.render());
  assert.ok(loading.some(node => node.type === "ActivityIndicator"));
  assert.ok(loading.some(node => node.type === "Text" && node.props.children.includes("Cargando sesión...")));
  await settle();
  assert.equal(calls, 0);
  initialized = true;
  view.render();
  await settle();
  const map = nodes(view.render()).find(node => node.type === "@features/home/components/RouteMap");
  assert.equal(calls, 1);
  assert.equal(map.props.stops.length, 1);
});

for (const [file, mapType, stopsProp] of [
  ["features/home/views/MainPage/MainPage.jsx", "@features/home/components/RouteMap", "stops"],
  ["features/gps/views/LiveTracking/LiveTracking.jsx", "@features/gps/components/GpsMap", "routeStops"],
]) {
  for (const failed of [false, true]) {
    test(`${file}: route ${failed ? "failure" : "absence"} leaves the map, navigation and status visible`, async () => {
      const view = harness(file, {
        "@core/hooks/useSession": () => ({ role: "student", initialized: true }),
        "@core/services/visibleRouteService": { resolveRouteForRole: async () => {
          if (failed) throw new Error("Route API offline");
          return { route: null, note: "No assigned route" };
        } },
        "@core/services/routeApi": { getRouteSuggestionApi: async () => {
          assert.fail("A missing route must not request road geometry");
        } },
      });
      view.render();
      await settle();
      const tree = nodes(view.render());
      const map = tree.find(node => node.type === mapType);
      assert.equal(map.props[stopsProp].length, 0);
      assert.ok(tree.some(node => node.type === "@components/layout/BottomTabBar"));
      assert.ok(tree.some(node => node.type === "Text" && node.props.children.includes(
        failed ? "No fue posible verificar la ruta asignada." : "No assigned route",
      )));
    });
  }

test(`${file}: clears old stops and ignores an in-flight response after changing roles`, async () => {
  let role = "student";
  let resolveStudent;
  const view = harness(file, {
    "@core/hooks/useSession": () => ({ role, initialized: true }),
    "@core/services/visibleRouteService": { resolveRouteForRole: async currentRole => {
      if (currentRole === "student") return new Promise(resolve => { resolveStudent = resolve; });
      return { route: null, note: "No linked students" };
    } },
    "@core/services/routeApi": { getRouteSuggestionApi: async () => ({}) },
  });
  view.render();
  await settle();
  role = "parent";
  view.render();
  await settle();
  resolveStudent({ route, note: null });
  await settle();
  const map = nodes(view.render()).find(n => n.type === mapType);
  assert.equal(map.props[stopsProp].length, 0);
});
}
