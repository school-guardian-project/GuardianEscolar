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

test('familyService returns each linked child named from the students list', async () => {
  const { service, calls } = await loadFamilyService((path) => {
    if (path === '/families') return [{ id: 'family-1' }, { id: 'family-2' }];
    if (path === '/families/family-1') return { parentProfileId: 'someone-else', children: ['x'] };
    if (path === '/families/family-2') {
      return { parentProfileId: 'parent-profile', children: ['profile-a', 'profile-b'] };
    }
    if (path === '/students') {
      return [
        { id: 'person-a', profileId: 'profile-a', name: 'Ana', lastName: 'Diaz' },
        { id: 'person-b', profileId: 'profile-b', name: 'Beto', lastName: '' },
      ];
    }
    throw new Error(`unexpected path ${path}`);
  });

  assert.deepEqual(plain(await service.getLinkedStudents(PARENT)), [
    { profileId: 'profile-a', name: 'Ana Diaz' },
    { profileId: 'profile-b', name: 'Beto' },
  ]);
  assert.ok(!calls.some((path) => path.startsWith('/students/')), 'no per-id student lookups');
});

test('familyService keeps every child when the students list fails', async () => {
  const { service } = await loadFamilyService((path) => {
    if (path === '/families') return [{ id: 'family-1' }];
    if (path === '/families/family-1') {
      return { parentProfileId: 'parent-person', children: ['profile-a', 'profile-b'] };
    }
    if (path === '/students') throw new Error('student service down');
    throw new Error(`unexpected path ${path}`);
  });

  assert.deepEqual(plain(await service.getLinkedStudents(PARENT)), [
    { profileId: 'profile-a', name: 'profile-a' },
    { profileId: 'profile-b', name: 'profile-b' },
  ]);
});

test('findMyFamily matches a student by its profileId', async () => {
  const { service } = await loadFamilyService((path) => {
    if (path === '/families') return [{ id: 'family-1' }];
    if (path === '/families/family-1') return { parentProfileId: 'p', children: ['student-profile'] };
    throw new Error(`unexpected path ${path}`);
  });

  const family = await service.findMyFamily({ roleId: 2, profileId: 'student-profile' });
  assert.equal(family.parentProfileId, 'p');
  assert.equal(await service.findMyFamily(null), null);
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
