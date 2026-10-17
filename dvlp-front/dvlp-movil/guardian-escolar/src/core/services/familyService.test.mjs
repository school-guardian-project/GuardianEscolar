import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

/**
 * Carga familyService.js en un contexto aislado con userApi simulado.
 * Mismo patrón que authService.test.mjs (requiere --experimental-vm-modules).
 */
async function loadFamilyService(handler) {
  const calls = [];
  const context = createContext({});
  const userApi = new SyntheticModule(
    ['getUserApi'],
    function () {
      this.setExport('getUserApi', async (path) => {
        calls.push(path);
        return handler(path);
      });
    },
    { context },
  );
  const module = new SourceTextModule(
    readFileSync(new URL('./familyService.js', import.meta.url), 'utf8'),
    { context },
  );
  await module.link((specifier) => {
    assert.equal(specifier, './userApi');
    return userApi;
  });
  await module.evaluate();
  return { service: module.namespace, calls };
}

/** Copia a objetos del realm actual (deepStrictEqual compara prototipos). */
function plain(list) {
  return [...list].map((item) => ({ ...item }));
}

const PARENT = { roleId: 4, personId: 'parent-person', profileId: 'parent-profile' };

test('familyService only resolves families for the guardian role', async () => {
  const { service, calls } = await loadFamilyService(() => {
    throw new Error('userApi must not be called');
  });

  assert.equal(service.PARENT_ROLE_ID, 4);
  assert.deepEqual(plain(await service.getLinkedStudents({ roleId: 2, profileId: 'student-id' })), []);
  assert.deepEqual(plain(await service.getLinkedStudents(null)), []);
  assert.deepEqual(calls, []);
});

test('familyService returns each linked child with its resolved name', async () => {
  const { service } = await loadFamilyService((path) => {
    if (path === '/families') return [{ id: 'family-1' }, { id: 'family-2' }];
    if (path === '/families/family-2') return { parentProfileId: 'someone-else', children: ['x'] };
    if (path === '/families/family-1') {
      return { parentProfileId: 'parent-profile', children: ['child-a', 'child-b'] };
    }
    if (path === '/students/child-a') return { profileId: 'profile-a', name: 'Ana', lastName: 'Diaz' };
    if (path === '/students/child-b') return { profileId: 'profile-b', name: 'Beto', lastName: '' };
    throw new Error(`unexpected path ${path}`);
  });

  assert.deepEqual(plain(await service.getLinkedStudents(PARENT)), [
    { profileId: 'profile-a', name: 'Ana Diaz' },
    { profileId: 'profile-b', name: 'Beto' },
  ]);
});

test('familyService skips a child that cannot be resolved without losing the rest', async () => {
  const { service } = await loadFamilyService((path) => {
    if (path === '/families') return [{ id: 'family-1' }];
    if (path === '/families/family-1') {
      return { parentProfileId: 'parent-person', children: ['child-a', 'child-b'] };
    }
    if (path === '/students/child-a') throw new Error('student service down');
    if (path === '/students/child-b') return { profileId: 'profile-b', name: 'Beto', lastName: 'Ruiz' };
    throw new Error(`unexpected path ${path}`);
  });

  assert.deepEqual(plain(await service.getLinkedStudents(PARENT)), [
    { profileId: 'profile-b', name: 'Beto Ruiz' },
  ]);
});

test('familyService returns an empty list without a matching family or when the backend fails', async () => {
  const noFamily = await loadFamilyService((path) => {
    if (path === '/families') return [{ id: 'family-1' }];
    return { parentProfileId: 'someone-else', children: [] };
  });
  assert.deepEqual(plain(await noFamily.service.getLinkedStudents(PARENT)), []);

  const offline = await loadFamilyService(() => {
    throw new Error('gateway offline');
  });
  assert.deepEqual(plain(await offline.service.getLinkedStudents(PARENT)), []);
});
