import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule } from 'node:vm';

const LOCALES = ['es', 'en', 'fr', 'pt'];

/**
 * Carga incidents.js aislado (no importa nada).
 */
async function loadIncidentTypes() {
  const context = createContext({});
  const module = new SourceTextModule(
    readFileSync(new URL('./incidents.js', import.meta.url), 'utf8'),
    { context },
  );
  await module.link(() => {
    throw new Error('incidents.js no deberia importar nada');
  });
  await module.evaluate();
  return module.namespace;
}

/** Lee un archivo de idioma. fr.json trae BOM, que JSON.parse no acepta. */
function readLocale(locale) {
  const raw = readFileSync(new URL(`../i18n/${locale}.json`, import.meta.url), 'utf8');
  return JSON.parse(raw.replace(/^\uFEFF/, ''));
}

test('el catalogo son los ids 21..24 del seed de FR-8.1, sin repetir', async () => {
  const { INCIDENT_TYPES } = await loadIncidentTypes();

  // `[...ids]` copia al arreglo del host: el del vm tiene otro prototipo.
  const ids = [...INCIDENT_TYPES.map((type) => type.alertTypeId)];

  assert.deepEqual(ids, [21, 22, 23, 24]);
  assert.equal(new Set(ids).size, ids.length);
});

test('cada tipo tiene etiqueta en los cuatro idiomas', async () => {
  const { INCIDENT_TYPES } = await loadIncidentTypes();

  for (const locale of LOCALES) {
    const messages = readLocale(locale);

    for (const type of INCIDENT_TYPES) {
      const [section, key] = type.labelKey.split('.');
      assert.equal(section, 'incidents');
      assert.equal(
        typeof messages.incidents?.[key],
        'string',
        `${locale}: falta ${type.labelKey}`,
      );
    }
  }
});

test('los cuatro idiomas exponen exactamente las mismas claves de incidentes', async () => {
  const [reference, ...others] = LOCALES.map(
    (locale) => readLocale(locale).incidents,
  );
  const expected = Object.keys(reference).sort();

  for (const messages of others) {
    assert.deepEqual(Object.keys(messages).sort(), expected);
  }
});

test('el limite del detalle coincide con el que aplica el backend', async () => {
  const { MAX_INCIDENT_DESCRIPTION } = await loadIncidentTypes();

  // ReportIncidentService.MaxDescriptionLength (FR-8.1).
  assert.equal(MAX_INCIDENT_DESCRIPTION, 500);
});

test('incidentTypeLabelKey devuelve la etiqueta solo para los tipos del catalogo', async () => {
  const { INCIDENT_TYPES, incidentTypeLabelKey } = await loadIncidentTypes();

  for (const type of INCIDENT_TYPES) {
    assert.equal(incidentTypeLabelKey(type.alertTypeId), type.labelKey);
  }

  // Ids fuera del catalogo: un abordaje (alertTypeId de los 20 tipos
  // operativos) y ruido no numerico no deben tratarse como incidente.
  assert.equal(incidentTypeLabelKey(1), null);
  assert.equal(incidentTypeLabelKey(20), null);
  assert.equal(incidentTypeLabelKey(undefined), null);
  assert.equal(incidentTypeLabelKey(null), null);
});
