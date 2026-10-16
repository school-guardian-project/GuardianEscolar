import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

/**
 * Carga notificationApi.ts en un contexto aislado con apiClient simulado.
 *
 * A diferencia de authService/familyService, este modulo es TypeScript, asi que
 * antes de meterlo al vm se le quitan los tipos con `node:module`. No hace falta
 * ts-node ni jest: el proyecto no los tiene. Requiere --experimental-vm-modules,
 * igual que authService.test.mjs.
 *
 * El contexto trae su propio `process.env`, de modo que las rutas se leen del
 * entorno como en la app y no de valores incrustados en el test.
 */
async function loadNotificationApi(handler, env = {}) {
  const calls = [];
  const context = createContext({
    process: {
      env: {
        EXPO_PUBLIC_NOTIFICATION_API_PREFIX: '/notification/api',
        EXPO_PUBLIC_NOTIFICATION_SCAN_PATH: '/v1/notifications/scan',
        EXPO_PUBLIC_NOTIFICATION_DEVICES_PATH: '/v1/notifications/devices',
        EXPO_PUBLIC_NOTIFICATION_CREDENTIAL_PATH: '/v1/notifications/credential',
        EXPO_PUBLIC_NOTIFICATION_GUARDIAN_PATH: '/v1/notifications/guardian',
        EXPO_PUBLIC_NOTIFICATION_INCIDENTS_PATH: '/v1/notifications/incidents',
        ...env,
      },
    },
  });

  const apiClient = new SyntheticModule(
    ['apiGet', 'apiPost'],
    function () {
      this.setExport('apiGet', async (path) => {
        calls.push({ method: 'GET', path });
        return handler('GET', path);
      });
      this.setExport('apiPost', async (path, body) => {
        calls.push({ method: 'POST', path, body });
        return handler('POST', path, body);
      });
    },
    { context },
  );

  const source = stripTypeScriptTypes(
    readFileSync(new URL('./notificationApi.ts', import.meta.url), 'utf8'),
  );
  const module = new SourceTextModule(source, { context });

  await module.link((specifier) => {
    assert.equal(specifier, './apiClient');
    return apiClient;
  });
  await module.evaluate();

  return { service: module.namespace, calls };
}

/**
 * Copia al realm actual. deepStrictEqual compara prototipos y los objetos que
 * cruzan el vm traen el Object de su propio contexto.
 */
const plain = (value) => JSON.parse(JSON.stringify(value));

test('scanCredential registra el abordaje con el token y el tipo de movimiento', async () => {
  const { service, calls } = await loadNotificationApi(() => undefined);

  await service.scanCredential('qr-token-1', 'ON_BOARD');

  assert.deepEqual(plain(calls), [
    {
      method: 'POST',
      path: '/notification/api/v1/notifications/scan',
      body: { qrToken: 'qr-token-1', boardingType: 'ON_BOARD' },
    },
  ]);
});

test('scanCredential distingue el descenso del abordaje', async () => {
  const { service, calls } = await loadNotificationApi(() => undefined);

  await service.scanCredential('qr-token-2', 'OFF_BOARD');

  assert.deepEqual(plain(calls[0].body), {
    qrToken: 'qr-token-2',
    boardingType: 'OFF_BOARD',
  });
});

test('scanCredential propaga el error del backend para que la pantalla lo muestre', async () => {
  const { service } = await loadNotificationApi(() => {
    throw Object.assign(new Error('conflict'), { status: 409 });
  });

  await assert.rejects(() => service.scanCredential('qr-token-3', 'ON_BOARD'), {
    status: 409,
  });
});

test('generateCredential devuelve la credencial del backend', async () => {
  const credential = { qrToken: 'signed-token', expiresAt: '2026-10-15T12:00:00Z' };
  const { service, calls } = await loadNotificationApi(() => credential);

  assert.deepEqual(plain(await service.generateCredential()), credential);
  assert.deepEqual(plain(calls), [
    { method: 'GET', path: '/notification/api/v1/notifications/credential' },
  ]);
});

test('registerDevice manda el token de push tal cual', async () => {
  const { service, calls } = await loadNotificationApi(() => undefined);

  await service.registerDevice({ expoToken: 'ExponentPushToken[abc]' });

  assert.deepEqual(plain(calls), [
    {
      method: 'POST',
      path: '/notification/api/v1/notifications/devices',
      body: { expoToken: 'ExponentPushToken[abc]' },
    },
  ]);
});

test('getGuardianNotifications devuelve la lista del backend', async () => {
  const notifications = [{ id: 'n1', alert: { id: 'a1' } }];
  const { service, calls } = await loadNotificationApi(() => notifications);

  assert.deepEqual(plain(await service.getGuardianNotifications()), notifications);
  assert.deepEqual(plain(calls), [
    { method: 'GET', path: '/notification/api/v1/notifications/guardian' },
  ]);
});

test('reportIncident manda el tipo y el detalle del incidente (FR-8.1)', async () => {
  const response = {
    alertId: 'alert-1',
    routeExecutionId: 'trip-1',
    studentsOnBoard: 3,
    recipientsNotified: 4,
  };
  const { service, calls } = await loadNotificationApi(() => response);

  const result = await service.reportIncident({
    alertTypeId: 21,
    description: 'Choque leve en la calle 5',
  });

  assert.deepEqual(plain(result), response);
  assert.deepEqual(plain(calls), [
    {
      method: 'POST',
      path: '/notification/api/v1/notifications/incidents',
      body: { alertTypeId: 21, description: 'Choque leve en la calle 5' },
    },
  ]);
});

test('reportIncident no inventa el viaje ni los destinatarios: el servidor los resuelve', async () => {
  const { service, calls } = await loadNotificationApi(() => undefined);

  await service.reportIncident({ alertTypeId: 23 });

  assert.deepEqual(plain(calls[0].body), { alertTypeId: 23 });
  assert.equal(calls[0].path, '/notification/api/v1/notifications/incidents');
});

test('reportIncident propaga el rechazo para que el modal lo traduzca', async () => {
  const { service } = await loadNotificationApi(() => {
    throw Object.assign(new Error('conflict'), {
      status: 409,
      data: { message: 'Driver has no active trip' },
    });
  });

  await assert.rejects(() => service.reportIncident({ alertTypeId: 22 }), {
    status: 409,
  });
});

test('las rutas salen del entorno y no de valores incrustados', async () => {
  const { service, calls } = await loadNotificationApi(() => undefined, {
    EXPO_PUBLIC_NOTIFICATION_API_PREFIX: '/otro-prefijo',
    EXPO_PUBLIC_NOTIFICATION_INCIDENTS_PATH: '/v9/incidentes',
  });

  await service.reportIncident({ alertTypeId: 24 });

  assert.deepEqual(plain(calls), [
    {
      method: 'POST',
      path: '/otro-prefijo/v9/incidentes',
      body: { alertTypeId: 24 },
    },
  ]);
});
