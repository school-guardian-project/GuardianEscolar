import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule } from 'node:vm';

/**
 * Carga incidentErrors.js aislado. El modulo no importa nada, asi que basta con
 * evaluarlo en su propio contexto (mismo patron que authService.test.mjs).
 */
async function loadIncidentErrors() {
  const context = createContext({});
  const module = new SourceTextModule(
    readFileSync(new URL('./incidentErrors.js', import.meta.url), 'utf8'),
    { context },
  );
  await module.link(() => {
    throw new Error('incidentErrors.js no deberia importar nada');
  });
  await module.evaluate();
  return module.namespace;
}

/** Un rechazo del backend tal como lo entrega apiClient. */
function apiError(status, message) {
  return Object.assign(new Error(String(status)), {
    status,
    ...(message === undefined ? {} : { data: { message } }),
  });
}

test('un 409 sin viaje activo lleva al mensaje que explica que falta iniciar la ruta', async () => {
  const { incidentErrorKey } = await loadIncidentErrors();

  assert.equal(
    incidentErrorKey(apiError(409, 'Driver has no active trip')),
    'incidents.noTrip',
  );
});

test('un 409 por tipo desconocido o detalle muy largo tiene su propio mensaje', async () => {
  const { incidentErrorKey } = await loadIncidentErrors();

  assert.equal(
    incidentErrorKey(apiError(409, 'Unknown incident type')),
    'incidents.unknownType',
  );
  assert.equal(
    incidentErrorKey(apiError(409, 'Incident description is too long')),
    'incidents.descriptionTooLong',
  );
});

test('un 409 con un mensaje nuevo cae en el mensaje generico y no deja al conductor sin texto', async () => {
  const { incidentErrorKey } = await loadIncidentErrors();

  assert.equal(incidentErrorKey(apiError(409, 'algo nuevo')), 'incidents.failed');
  assert.equal(incidentErrorKey(apiError(409)), 'incidents.failed');
});

test('el 403 (no es el conductor asignado) y el 503 (dependencia caida) se distinguen', async () => {
  const { incidentErrorKey } = await loadIncidentErrors();

  assert.equal(incidentErrorKey(apiError(403)), 'incidents.forbidden');
  assert.equal(incidentErrorKey(apiError(503)), 'incidents.unavailable');
});

test('cualquier otro fallo (red caida, 500) usa el mensaje generico', async () => {
  const { incidentErrorKey } = await loadIncidentErrors();

  assert.equal(incidentErrorKey(apiError(500)), 'incidents.failed');
  assert.equal(incidentErrorKey(new Error('Network request failed')), 'incidents.failed');
  assert.equal(incidentErrorKey(undefined), 'incidents.failed');
  assert.equal(incidentErrorKey(null), 'incidents.failed');
  assert.equal(incidentErrorKey('boom'), 'incidents.failed');
});
