import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

/**
 * Carga termsService.js en un contexto aislado con apiClient, authService y
 * familyService simulados. Mismo patrón que familyService.test.mjs.
 */
async function loadTermsService({ session, acceptances, linked = [] }) {
  const posts = [];
  const context = createContext({});
  const apiClient = new SyntheticModule(
    ['apiGet', 'apiPost'],
    function () {
      this.setExport('apiGet', async (path) => {
        assert.equal(path, '/api/v1/auth/terms/acceptances');
        if (acceptances instanceof Error) throw acceptances;
        return acceptances;
      });
      this.setExport('apiPost', async (path, body) => {
        posts.push({ path, body: JSON.parse(JSON.stringify(body)) });
        return [];
      });
    },
    { context },
  );
  const authService = new SyntheticModule(
    ['getSession'],
    function () {
      this.setExport('getSession', async () => session);
    },
    { context },
  );
  const familyService = new SyntheticModule(
    ['getLinkedStudents', 'PARENT_ROLE_ID'],
    function () {
      this.setExport('getLinkedStudents', async () => linked);
      this.setExport('PARENT_ROLE_ID', 4);
    },
    { context },
  );
  const module = new SourceTextModule(
    readFileSync(new URL('./termsService.js', import.meta.url), 'utf8'),
    { context },
  );
  await module.link((specifier) => ({
    './apiClient': apiClient,
    './authService': authService,
    './familyService': familyService,
  })[specifier]);
  await module.evaluate();
  return { service: module.namespace, posts };
}

const PARENT = { roleId: 4, profileId: 'parent-profile' };
const DRIVER = { roleId: 3, profileId: 'driver-profile' };

test('termsService shows the modal only to driver and guardian', async () => {
  const { service } = await loadTermsService({ session: DRIVER, acceptances: [] });

  assert.equal(service.requiresTermsModal(3), true);
  assert.equal(service.requiresTermsModal(4), true);
  assert.equal(service.requiresTermsModal(2), false);
  assert.equal(service.requiresTermsModal(1), false);
  assert.equal(service.requiresTermsModal(undefined), false);
});

test('termsService has nothing pending once the current version is accepted', async () => {
  const { service } = await loadTermsService({
    session: PARENT,
    acceptances: [
      { termsVersion: '2026.08', studentProfileId: null },
      { termsVersion: '2026.08', studentProfileId: 'kid-a' },
    ],
    linked: [{ profileId: 'kid-a' }],
  });

  const pending = await service.getPendingAcceptance();
  assert.equal(pending.ownMissing, false);
  assert.equal(pending.minors.length, 0);
  assert.equal(service.hasPendingAcceptance(pending), false);
});

test('termsService flags an older version and uncovered children as pending', async () => {
  const { service } = await loadTermsService({
    session: PARENT,
    acceptances: [
      { termsVersion: '2025.01', studentProfileId: null },
      { termsVersion: '2026.08', studentProfileId: 'kid-a' },
    ],
    linked: [{ profileId: 'kid-a' }, { profileId: 'kid-b' }],
  });

  const pending = await service.getPendingAcceptance();
  assert.equal(pending.ownMissing, true);
  assert.deepEqual(pending.minors.map((m) => m.profileId), ['kid-b']);
  assert.equal(service.hasPendingAcceptance(pending), true);
});

test('termsService propagates a failed lookup instead of assuming it is pending', async () => {
  const { service } = await loadTermsService({
    session: DRIVER,
    acceptances: Object.assign(new Error('offline'), { status: 0 }),
  });

  await assert.rejects(service.getPendingAcceptance(), /offline/);
});

test('termsService records minors first and then its own acceptance from mobile', async () => {
  const { service, posts } = await loadTermsService({ session: PARENT, acceptances: [] });

  await service.acceptPending({
    termsVersion: '2026.08',
    ownMissing: true,
    minors: [{ profileId: 'kid-a' }, { profileId: 'kid-b' }],
  });

  assert.deepEqual(posts, [
    {
      path: '/api/v1/auth/terms/accept',
      body: { termsVersion: '2026.08', studentProfileIds: ['kid-a', 'kid-b'], channel: 'mobile' },
    },
    {
      path: '/api/v1/auth/terms/accept',
      body: { termsVersion: '2026.08', studentProfileIds: [], channel: 'mobile' },
    },
  ]);
});

test('termsService skips the own acceptance when only children are missing', async () => {
  const { service, posts } = await loadTermsService({ session: PARENT, acceptances: [] });

  await service.acceptPending({
    termsVersion: '2026.08',
    ownMissing: false,
    minors: [{ profileId: 'kid-b' }],
  });

  assert.equal(posts.length, 1);
  assert.deepEqual(posts[0].body.studentProfileIds, ['kid-b']);
});
