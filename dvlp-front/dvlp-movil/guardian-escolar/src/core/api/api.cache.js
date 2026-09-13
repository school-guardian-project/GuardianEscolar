// [MOCK-API] Cache en memoria con TTL + deduplicación de vuelos (rendimiento)
// Reutilizable en cualquier cliente. No persiste en disco (evita PII en storage).

const cache = new Map(); // key -> { data, expiresAt }
const inflight = new Map(); // key -> Promise

export const CACHE_TTL_MS = 60_000; // 60s para GET idempotentes

function keyOf(method, url) {
  return `${method}:${url}`;
}

export function getCached(method, url) {
  const k = keyOf(method, url);
  const entry = cache.get(k);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(k);
    return null;
  }
  return entry.data;
}

export function setCached(method, url, data, ttl = CACHE_TTL_MS) {
  const k = keyOf(method, url);
  cache.set(k, { data, expiresAt: Date.now() + ttl });
}

export function dedupGet(key, factory) {
  if (inflight.has(key)) return inflight.get(key);
  const p = factory().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

export function clearCache() {
  cache.clear();
  inflight.clear();
}
