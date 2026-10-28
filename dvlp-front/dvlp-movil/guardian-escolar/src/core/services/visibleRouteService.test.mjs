import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";

async function loadService(handler, students = [], fleetHandler = () => {
  throw Object.assign(new Error("No assigned bus"), { status: 404 });
}) {
  const calls = [];
  const context = createContext({ console: { error() {} } });
  const module = new SourceTextModule(
    readFileSync(new URL("./visibleRouteService.js", import.meta.url), "utf8"), { context },
  );
  await module.link(specifier => {
    const exports = specifier === "./routeApi"
      ? { getRouteApi: async path => { calls.push(path); return handler(path); } }
      : specifier === "./fleetApi"
        ? { getFleetApi: async path => { calls.push(`fleet:${path}`); return fleetHandler(path); } }
        : { getLinkedStudents: async () => students };
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    }, { context });
  });
  await module.evaluate();
  return { resolve: module.namespace.resolveRouteForRole, calls };
}

const route = { id: "route-1", stops: [{ id: "stop-1", latitude: 2.9, longitude: -75.2 }] };

for (const [role, profile, expected] of [
  ["student", "student-1", "/routes/student/student-1"],
  ["parent", "parent-1", "/routes/student/child-1"],
  ["driver", "driver-1", "/routes/today?driverId=driver-1"],
]) {
  test(`${role} receives its authorized route with stops, never the global route list`, async () => {
    const { resolve, calls } = await loadService(path => {
      assert.equal(path, expected);
      return role === "driver" ? { status: "ACTIVE", route } : route;
    }, [{ profileId: "child-1" }]);
    assert.equal((await resolve(role, { profileId: profile })).route, route);
    assert.deepEqual(calls, [expected]);
  });
}

test("admin fetches route detail because list entries do not contain stops", async () => {
  const { resolve, calls } = await loadService(path =>
    path === "/routes" ? [{ id: route.id, stopsCount: 1 }] : route);
  assert.equal((await resolve("admin", { profileId: "admin-1" })).route, route);
  assert.deepEqual(calls, ["/routes", "/routes/route-1"]);
});

test("scheduled driver sees the assigned bus and route summary without activating the trip", async () => {
  const scheduledRoute = {
    id: route.id, stops: [], bus: { id: "bus-1", plate: "ABC123", driverName: "Driver" },
  };
  const { resolve, calls } = await loadService(() => ({
    status: "SCHEDULED", route: scheduledRoute, nextOccurrence: "2026-10-28T07:00:00-05:00",
  }));
  const result = await resolve("driver", { profileId: "driver-1" });
  assert.equal(result.route, scheduledRoute);
  assert.equal(result.route.bus.plate, "ABC123");
  assert.deepEqual(result.route.stops, []);
  assert.match(result.note, /próximo recorrido/);
  assert.equal(calls.length, 1);
});

test("driver without active schedules still sees the assigned route and bus with an explicit notice", async () => {
  const assignedRoute = { id: route.id, stops: [], bus: { id: "bus-1", plate: "ABC123" } };
  const { resolve } = await loadService(() => ({ status: "NO_SCHEDULE", route: assignedRoute }));
  const result = await resolve("driver", { profileId: "driver-1" });
  assert.equal(result.route, assignedRoute);
  assert.match(result.note, /no tiene horarios activos/);
});

test("unassigned driver does not receive a made-up route or bus", async () => {
  const { resolve } = await loadService(() => ({ status: "NO_ROUTE", route: null }));
  const result = await resolve("driver", { profileId: "driver-1" });
  assert.equal(result.route, null);
  assert.equal(result.bus, null);
  assert.ok(result.note);
});

test("driver sees their assigned bus even when the bus has no active route", async () => {
  const bus = { id: "bus-1", plate: "ABC123", driverName: "Driver" };
  const { resolve, calls } = await loadService(
    () => ({ status: "NO_ROUTE", route: null }), [], () => bus);
  const result = await resolve("driver", { profileId: "driver-1" });
  assert.equal(result.bus, bus);
  assert.equal(result.route, null);
  assert.match(result.note, /no tiene una ruta activa/);
  assert.deepEqual(calls, [
    "/routes/today?driverId=driver-1", "fleet:/buses/assigned/driver-1", "fleet:/buses/bus-1",
  ]);
});

for (const status of [403, 500]) {
  test(`bus lookup failure ${status} is not presented as a missing assignment`, async () => {
    const error = Object.assign(new Error("Bus request failed"), { status });
    const { resolve } = await loadService(
      () => ({ status: "NO_ROUTE", route: null }), [], () => { throw error; });
    await assert.rejects(resolve("driver", { profileId: "driver-1" }), error);
  });
}

test("malformed or mismatched fleet responses are errors, not an unassigned driver", async () => {
  for (const fleetHandler of [
    () => ({}),
    path => path.includes("/assigned/") ? { id: "bus-1" } : { id: "other-bus" },
  ]) {
    const { resolve } = await loadService(
      () => ({ status: "NO_ROUTE", route: null }), [], fleetHandler);
    await assert.rejects(resolve("driver", { profileId: "driver-1" }));
  }
});

for (const status of [403, 409, 500]) {
  test(`driver still sees the assigned bus with an explicit notice when route lookup fails ${status}`, async () => {
    const error = Object.assign(new Error("Route service failure"), { status });
    const bus = { id: "bus-1", plate: "ABC123" };
    const { resolve } = await loadService(() => { throw error; }, [], () => bus);
    const result = await resolve("driver", { profileId: "driver-1" });
    assert.equal(result.bus, bus);
    assert.equal(result.route, null);
    assert.ok(result.note.includes(`HTTP ${status}`));
  });
}

test("route failure is still an error when no assigned bus can be verified", async () => {
  const error = Object.assign(new Error("Route service failure"), { status: 500 });
  const { resolve } = await loadService(() => { throw error; });
  await assert.rejects(resolve("driver", { profileId: "driver-1" }), error);
});

test("missing session, unlinked parent and empty admin list return explicit notices", async () => {
  const { resolve, calls } = await loadService(() => []);
  for (const [role, session] of [
    ["student", null], ["parent", { profileId: "p" }], ["admin", { profileId: "a" }],
  ]) {
    const result = await resolve(role, session);
    assert.equal(result.route, null);
    assert.ok(result.note);
  }
  assert.deepEqual(calls, ["/routes"]);
});

test("unassigned student receives a notice for 404, but access and server failures propagate", async () => {
  for (const status of [404, 403, 500]) {
    const error = Object.assign(new Error("route request failed"), { status });
    const { resolve } = await loadService(() => { throw error; });
    if (status === 404) {
      const result = await resolve("student", { profileId: "s" });
      assert.equal(result.route, null);
      assert.ok(result.note);
    } else {
      await assert.rejects(resolve("student", { profileId: "s" }), error);
    }
  }
});

test("unknown roles cannot fall through to the global route list", async () => {
  const { resolve, calls } = await loadService(() => { throw new Error("unexpected request"); });
  await assert.rejects(resolve("unknown", { profileId: "x" }), /Unsupported/);
  assert.deepEqual(calls, []);
});
