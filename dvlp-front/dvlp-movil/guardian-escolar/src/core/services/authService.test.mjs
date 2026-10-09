import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

test('mobile sessions distinguish school/campus, use JWT sub, and clear old associations', async () => {
  const storage = new Map();
  let response;
  const context = createContext({
    process: { env: { EXPO_PUBLIC_API_URL: 'http://test.invalid' } },
    AbortController, setTimeout, clearTimeout, atob,
    fetch: async () => ({ ok: true, status: 200, json: async () => response }),
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
  const module = new SourceTextModule(readFileSync(new URL('./authService.js', import.meta.url), 'utf8'), { context });
  await module.link((specifier) => {
    assert.equal(specifier, 'expo-secure-store');
    return store;
  });
  await module.evaluate();
  const auth = module.namespace;
  const token = (claims) => `header.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;

  response = { accessToken: token({ sub: 'admin-id', personId: 'person-id', roleId: 1, schoolId: 'school-id' }), refreshToken: 'test-refresh' };
  await auth.login('admin@example.invalid', 'test');
  assert.equal((await auth.getSession()).schoolId, 'school-id');
  assert.equal((await auth.getSession()).campusId, null);
  assert.equal((await auth.getSession()).profileId, 'admin-id');

  response = { accessToken: token({ sub: 'student-id', roleId: 2, schoolId: 'other-school', campusId: 'campus-id' }), refreshToken: 'test-refresh' };
  await auth.login('student@example.invalid', 'test');
  assert.equal((await auth.getSession()).campusId, 'campus-id');
  assert.equal((await auth.getSession()).schoolId, 'other-school');

  response = { accessToken: token({ sub: 'student-id', roleId: 2 }), refreshToken: 'new-refresh' };
  await auth.refresh();
  assert.equal((await auth.getSession()).profileId, 'student-id');
  assert.equal((await auth.getSession()).schoolId, null);
  assert.equal((await auth.getSession()).campusId, null);
  assert.equal(JSON.parse(storage.get('user_session')).schoolId, null);
});
