import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";

async function loadService(handler, students = []) {
  const calls = [];
  const context = createContext({});
  const module = new SourceTextModule(
    readFileSync(new URL("./visibleRouteService.js", import.meta.url), "utf8"), { context },
  );
  await module.link(specifier => {
    const exports = specifier === "./routeApi"
      ? { getRouteApi: async path => { calls.push(path); return handler(path); } }
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

test("scheduled driver retains the backend time window and sees the next trip notice", async () => {
  const { resolve, calls } = await loadService(() => ({
    status: "SCHEDULED", route: { id: route.id }, nextOccurrence: "2026-10-28T07:00:00-05:00",
  }));
  const result = await resolve("driver", { profileId: "driver-1" });
  assert.equal(result.route, null);
  assert.match(result.note, /próximo recorrido/);
  assert.equal(calls.length, 1);
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
