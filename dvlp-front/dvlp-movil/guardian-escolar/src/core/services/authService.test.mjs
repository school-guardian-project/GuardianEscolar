import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

async function createAuthFixture() {
  const storage = new Map();
  let response;
  let roleChanges = 0;
  const context = createContext({
    process: { env: { EXPO_PUBLIC_API_URL: 'http://test.invalid' } },
    AbortController, AbortSignal, setTimeout, clearTimeout, atob,
    fetch: async () => ({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => response,
    }),
  });
  const store = new SyntheticModule(
    ['isAvailableAsync', 'setItemAsync', 'getItemAsync', 'deleteItemAsync'],
    function () {
      this.setExport('isAvailableAsync', async () => true);
      this.setExport('setItemAsync', async (key, value) => storage.set(key, value));
      this.setExport('getItemAsync', async (key) => storage.get(key) ?? null);
      this.setExport('deleteItemAsync', async (key) => storage.delete(key));
    }, { context },
  );
  const roleSwitcher = new SyntheticModule(
    ['notifyAuthRoleChange'],
    function () {
      this.setExport('notifyAuthRoleChange', () => { roleChanges += 1; });
    }, { context },
  );
  const module = new SourceTextModule(readFileSync(new URL('./authService.js', import.meta.url), 'utf8'), { context });
  await module.link((specifier) => {
    if (specifier === '@core/dev/RoleSwitcherContext') return roleSwitcher;
    assert.equal(specifier, 'expo-secure-store');
    return store;
  });
  await module.evaluate();
  return {
    auth: module.namespace,
    storage,
    respondWith(data) { response = data; },
    get roleChanges() { return roleChanges; },
  };
}

test('mobile sessions distinguish school/campus, use JWT sub, and clear old associations', async () => {
  const fixture = await createAuthFixture();
  const { auth, storage } = fixture;
  const token = (claims) => `header.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;

  fixture.respondWith({ accessToken: token({ sub: 'admin-id', personId: 'person-id', roleId: 1, schoolId: 'school-id' }), refreshToken: 'test-refresh' });
  await auth.login('admin@example.invalid', 'test');
  assert.equal(fixture.roleChanges, 1);
  assert.equal((await auth.getSession()).schoolId, 'school-id');
  assert.equal((await auth.getSession()).campusId, null);
  assert.equal((await auth.getSession()).profileId, 'admin-id');

  fixture.respondWith({ accessToken: token({ sub: 'student-id', roleId: 2, schoolId: 'other-school', campusId: 'campus-id' }), refreshToken: 'test-refresh' });
  await auth.login('student@example.invalid', 'test');
  assert.equal((await auth.getSession()).campusId, 'campus-id');
  assert.equal((await auth.getSession()).schoolId, 'other-school');

  fixture.respondWith({ accessToken: token({ sub: 'student-id', roleId: 2 }), refreshToken: 'new-refresh' });
  await auth.refresh();
  assert.equal(fixture.roleChanges, 3);
  assert.equal(storage.get('refresh_token'), 'new-refresh');
  assert.equal((await auth.getSession()).profileId, 'student-id');
  assert.equal((await auth.getSession()).schoolId, null);
  assert.equal((await auth.getSession()).campusId, null);
  assert.equal(JSON.parse(storage.get('user_session')).schoolId, null);
});

test('mobile sessions expose the RBAC claims (role name, document number, permissions)', async () => {
  const fixture = await createAuthFixture();
  const { auth, storage } = fixture;
  const token = (claims) => `header.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;

  fixture.respondWith({
    accessToken: token({
      sub: 'admin-id', roleId: 1, role: 'Admin', documentNumber: '99000000001',
      permissions: ['students.read', 'buses.read'],
    }),
    refreshToken: 'test-refresh',
  });
  await auth.login('admin@example.invalid', 'test');

  assert.equal(auth.getRoleName(), 'Admin');
  assert.equal(auth.getIdentificationNumber(), '99000000001');
  assert.deepEqual([...auth.getPermissions()], ['students.read', 'buses.read']);
  assert.equal(auth.hasPermission('students.read', 'drivers.read'), true);
  assert.equal(auth.hasPermission('drivers.read'), false);
  assert.equal(auth.hasPermission(), false);

  assert.equal((await auth.getSession()).roleName, 'Admin');
  assert.equal((await auth.getSession()).identificationNumber, '99000000001');
  assert.deepEqual([...(await auth.getSession()).permissions], ['students.read', 'buses.read']);

  await auth.logout();
  assert.equal(await auth.getSession(), null);
  assert.equal(storage.has('refresh_token'), false);
  assert.equal(storage.has('user_session'), false);
  assert.equal(auth.getRoleName(), null);
  assert.equal(auth.getIdentificationNumber(), null);
  assert.deepEqual([...auth.getPermissions()], []);
  assert.equal(auth.hasPermission('students.read'), false);
});
