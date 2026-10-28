import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import * as mapData from "./routeMapData.js";
import * as loginValidators from "../../core/validation/validators.js";

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
      View: "View", Text: "Text", Pressable: "Pressable", ScrollView: "ScrollView", ActivityIndicator: "ActivityIndicator",
      StyleSheet: { create: value => value, absoluteFill: {}, absoluteFillObject: {} },
    },
    "react-native-maps": { __esModule: true, default: "MapView", Marker: "Marker", Polyline: "Polyline" },
    "@expo/vector-icons": { FontAwesome5: "Icon", Ionicons: "Icon", MaterialIcons: "Icon" },
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
    module, exports: module.exports, console: { error() {}, warn() {}, log() {} },
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

test("driver sees their bus without a route, without stops or trip actions", async () => {
  const view = harness("features/home/views/MainPage/MainPage.jsx", {
    "@core/hooks/useSession": () => ({ role: "driver", initialized: true }),
    "@core/services/visibleRouteService": { resolveRouteForRole: async () => ({
      route: null, bus: { id: "bus-1", plate: "ABC123", driverName: "Test Driver" },
      note: "Bus asignado sin ruta activa.",
    }) },
    "@core/services/tripApi": { getTripStatusApi: async () => ({ CanStart: true }) },
  });
  view.render();
  await settle();
  const tree = view.render();
  const card = nodes(tree).find(node => node.type === "@components/cards/RouteInfoCard");
  assert.equal(card.props.plate, "ABC123");
  assert.equal(card.props.driverName, "Test Driver");
  assert.equal(card.props.routeName, "");
  assert.equal(nodes(tree).some(node => node.type === "@components/buttons/TripActionButton"), false);
  const map = nodes(tree).find(node => node.type === "@features/home/components/RouteMap");
  assert.equal(map.props.stops.length, 0);
});

for (const note of ["Tu próximo recorrido es mañana.", "Tu ruta aún no tiene horarios activos."]) {
  test(`driver summary preserves bus and driver metadata without enabling trip actions: ${note}`, async () => {
    const assigned = {
      ...route, stops: [], startTime: "06:00:00", endTime: "08:00:00",
      bus: { id: "bus-1", plate: "ABC123", driverName: "Test Driver" },
    };
    const view = harness("features/home/views/MainPage/MainPage.jsx", {
      "@core/hooks/useSession": () => ({ role: "driver", initialized: true }),
      "@core/services/visibleRouteService": { resolveRouteForRole: async () => ({ route: assigned, note }) },
      "@core/services/tripApi": { getTripStatusApi: async () => ({ CanStart: false, CanEnd: false }) },
    });
    view.render();
    await settle();
    const tree = view.render();
    const card = nodes(tree).find(node => node.type === "@components/cards/RouteInfoCard");
    assert.equal(card.props.plate, "ABC123");
    assert.equal(card.props.driverName, "Test Driver");
    assert.equal(card.props.routeName, route.name);
    const actions = nodes(tree).find(node => node.type === "@components/buttons/TripActionButton");
    assert.equal(actions.props.canStart, false);
    assert.equal(actions.props.canEnd, false);
    assert.equal(actions.props.status, "idle");
    const map = nodes(tree).find(node => node.type === "@features/home/components/RouteMap");
    assert.equal(map.props.stops.length, 0);
    assert.ok(nodes(tree).some(node => node.type === "Text" && node.props.children.includes(note)));
  });
}

for (const screen of ["features/home/views/MainPage/MainPage.jsx", "features/gps/views/LiveTracking/LiveTracking.jsx"]) {
  test(`${screen} reloads the student assignment on focus and ignores an obsolete response`, async () => {
    let focused = true;
    const pending = [];
    const view = harness(screen, {
      "@react-navigation/native": { useNavigation: () => ({}), useIsFocused: () => focused },
      "@core/hooks/useSession": () => ({ role: "student", initialized: true }),
      "@core/services/visibleRouteService": { resolveRouteForRole: () =>
        new Promise(resolve => pending.push(resolve)) },
      "@core/services/routeApi": { getRouteSuggestionApi: async () => null },
    });
    view.render();
    await settle();
    assert.equal(pending.length, 1);
    focused = false;
    view.render();
    pending[0]({ route, note: null });
    await settle();
    focused = true;
    view.render();
    await settle();
    assert.equal(pending.length, 2);
    const updated = { ...route, id: "new-route", stops: [{ ...route.stops[0], id: "new-stop" }] };
    pending[1]({ route: updated, note: null });
    await settle();
    const tree = view.render();
    const map = nodes(tree).find(node => node.type === "@features/home/components/RouteMap"
      || node.type === "@features/gps/components/GpsMap");
    assert.ok(map);
    const displayedStops = map.props.stops ?? map.props.routeStops;
    assert.equal(displayedStops[0].id, "new-stop");
  });
}

function loadMainStyles() {
  const compiled = transformSync(readFileSync(new URL(
    "features/home/views/MainPage/MainPage.style.jsx", sourceRoot,
  ), "utf8"), {
    babelrc: false, configFile: false,
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  }).code;
  const module = { exports: {} };
  runInNewContext(compiled, {
    module, exports: module.exports,
    require: () => ({ StyleSheet: {
      create: value => value,
      absoluteFillObject: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
    } }),
  });
  return module.exports.default;
}

for (const role of ["student", "parent", "driver", "admin"]) {
  for (const bottom of [0, 24, 34]) {
    test(`MainPage: ${role} keeps its bottom dock anchored while loading with inset ${bottom}`, async () => {
      let resolveRoute;
      const styles = loadMainStyles();
      const view = harness("features/home/views/MainPage/MainPage.jsx", {
        "./MainPage.style": styles,
        "@core/hooks/useSession": () => ({ role, initialized: true }),
        "react-native-safe-area-context": { useSafeAreaInsets: () => ({ top: 24, bottom }) },
        "@core/services/visibleRouteService": { resolveRouteForRole: () =>
          new Promise(resolve => { resolveRoute = resolve; }) },
      });
      function assertDock(tree) {
        const dock = tree.props.children.find(child => child?.props?.style === styles.bottomSection);
        assert.ok(dock, "The dock must be a direct child, independent of the action overlay");
        assert.equal(dock.props.style.position, "absolute");
        assert.equal(dock.props.style.bottom, 0);
        assert.equal(dock.props.style.left, 0);
        assert.equal(dock.props.style.right, 0);
        assert.equal(styles.container.flex, 1);
        assert.equal(styles.container.height, undefined, "Do not retain a stale percentage screen height");
        const tabs = nodes(dock).find(node => node.type === "@components/layout/BottomTabBar");
        assert.equal(tabs.props.bottomInset, bottom);
        assert.equal(nodes(tree).filter(node => node.type === "@components/layout/BottomTabBar").length, 1);
      }
      assertDock(view.render());
      await settle();
      resolveRoute({ route, note: null });
      await settle();
      assertDock(view.render());
    });
  }
}

for (const bottomInset of [0, 24, 34]) {
  test(`BottomTabBar: preserves 72px controls above the ${bottomInset}px system inset`, () => {
    const destinations = [];
    const view = harness("components/layout/BottomTabBar.jsx", {
      "@react-navigation/native": { useNavigation: () => ({
        navigate: name => destinations.push(name),
      }) },
    });
    const tree = view.render({ bottomInset, onLocationPress: () => destinations.push("LiveTracking") });
    const style = Object.assign({}, ...tree.props.style);
    assert.equal(style.height, 72 + bottomInset);
    assert.equal(style.paddingBottom, bottomInset);
    assert.equal(style.height - style.paddingBottom, 72);
    assert.equal(style.flexShrink, 0);
    nodes(tree).filter(node => node.type === "Pressable").forEach(tab => tab.props.onPress());
    assert.deepEqual(destinations, ["MainPage", "LiveTracking", "Profile"]);
  });
}

function loginHarness(events, { roleId = 2, pending = null } = {}) {
  return harness("features/auth/views/Login/Login.jsx", {
    "react-native": {
      ScrollView: "ScrollView", View: "View", Text: "Text",
      Keyboard: { dismiss: () => events.push("dismiss") },
    },
    "expo-asset": { Asset: { fromModule: () => ({ uri: "local-logo" }) } },
    "react-native-svg": { SvgUri: "SvgUri" },
    "./Login.styles": { styles: {} },
    "./LegalInfoModal": "LegalInfoModal",
    "./TermsAcceptanceModal": "TermsAcceptanceModal",
    "../../../../../assets/logo-blue.svg": 1,
    "@core/validation/validators": loginValidators,
    "@core/services/authService": {
      login: async () => { events.push("login"); },
      getSession: async () => ({ roleId }),
      clearSession: async () => { events.push("clearSession"); },
    },
    "@core/services/termsService": {
      CURRENT_TERMS_VERSION: "1",
      requiresTermsModal: id => id === 3 || id === 4,
      getPendingAcceptance: async () => { events.push("pending"); return pending; },
      hasPendingAcceptance: value => Boolean(value?.ownMissing || value?.minors?.length > 0),
      acceptPending: async () => { events.push("accept"); },
    },
    "@core/services/pushService": { registerPushDevice() {} },
    "@core/hooks/useSession": () => ({ applyAuthRole: async () => { events.push("role"); } }),
  });
}

test("Login dismisses the keyboard before authenticating and opening MainPage", async () => {
  const events = [];
  const view = loginHarness(events);
  const props = { navigation: { navigate: name => events.push(name) } };
  const inputs = nodes(view.render(props)).filter(node => node.type === "@components/inputs/InputField");
  inputs[0].props.onChangeText("student@example.com");
  inputs[1].props.onChangeText("password");
  nodes(view.render(props)).find(node => node.type === "@components/buttons/PrimaryButton").props.onPress();
  await settle();
  assert.deepEqual(events, ["dismiss", "login", "role", "MainPage"]);
});

async function submitLogin(view, props) {
  const inputs = nodes(view.render(props)).filter(node => node.type === "@components/inputs/InputField");
  inputs[0].props.onChangeText("user@example.com");
  inputs[1].props.onChangeText("password");
  nodes(view.render(props)).find(node => node.type === "@components/buttons/PrimaryButton").props.onPress();
  await settle();
}

const termsModal = (view, props) => nodes(view.render(props)).find(node => node.type === "TermsAcceptanceModal");

test("Login lets a driver who already accepted the current terms straight into MainPage", async () => {
  const events = [];
  const view = loginHarness(events, { roleId: 3, pending: { ownMissing: false, minors: [] } });
  const props = { navigation: { navigate: name => events.push(name) } };
  await submitLogin(view, props);
  assert.deepEqual(events, ["dismiss", "login", "role", "pending", "MainPage"]);
  assert.equal(termsModal(view, props).props.visible, false);
});

test("Login holds a guardian with pending terms on the modal until they accept", async () => {
  const events = [];
  const view = loginHarness(events, { roleId: 4, pending: { ownMissing: true, minors: [{ profileId: "kid" }] } });
  const props = { navigation: { navigate: name => events.push(name) } };
  await submitLogin(view, props);
  assert.deepEqual(events, ["dismiss", "login", "role", "pending"]);
  const modal = termsModal(view, props);
  assert.equal(modal.props.visible, true);
  assert.equal(modal.props.minorsCount, 1);

  modal.props.onAccept();
  await settle();
  assert.deepEqual(events.slice(4), ["accept", "MainPage"]);
  assert.equal(termsModal(view, props).props.visible, false);
});

test("Login drops the stored session when the terms modal is closed without accepting", async () => {
  const events = [];
  const view = loginHarness(events, { roleId: 3, pending: { ownMissing: true, minors: [] } });
  const props = { navigation: { navigate: name => events.push(name) } };
  await submitLogin(view, props);
  termsModal(view, props).props.onClose();
  await settle();
  assert.deepEqual(events.slice(4), ["clearSession"]);
  assert.equal(termsModal(view, props).props.visible, false);
});

test("Login keeps validation failures on the form without authenticating or dismissing the keyboard", () => {
  const events = [];
  const view = loginHarness(events);
  const props = { navigation: { navigate: name => events.push(name) } };
  nodes(view.render(props)).find(node => node.type === "@components/buttons/PrimaryButton").props.onPress();
  const inputs = nodes(view.render(props)).filter(node => node.type === "@components/inputs/InputField");
  assert.equal(inputs[0].props.error, loginValidators.validateEmail(""));
  assert.equal(inputs[1].props.error, loginValidators.validateRequired("", "Enter your password"));
  assert.deepEqual(events, []);
});

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
