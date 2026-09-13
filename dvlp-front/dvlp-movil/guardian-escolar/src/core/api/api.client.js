// [MOCK-API] Cliente HTTP — reutilizable, seguro y performante.
// Principios: DRY (factory), validación, cache+dedup, no log de PII, manejo tipado de errores.

import { API_CONFIG } from "./api.config";
import { ApiError, ValidationError } from "./api.errors";
import { sanitizeQuery, assertSafePath } from "./api.validators";
import { getCached, setCached, dedupGet, CACHE_TTL_MS } from "./api.cache";

/**
 * Construye URL validando path y sanitizando query.
 * @param {string} path ej. "/persons"
 * @param {Record<string,any>} query
 */
function buildUrl(path, query = {}) {
  assertSafePath(path);
  const safeQuery = sanitizeQuery(path, query);
  const url = new URL(`${API_CONFIG.BASE_URL}${path}`);
  for (const [k, v] of Object.entries(safeQuery)) {
    if (v !== "" && v != null) url.searchParams.set(k, String(v));
  }
  return url.toString();
}

function maskUrl(url) {
  // Evitar log de Email u otros identificadores completos en prod
  try {
    const u = new URL(url);
    if (u.searchParams.has("Email")) u.searchParams.set("Email", "***@***");
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Request con timeout, cache GET, dedup y errores tipados.
 * @param {string} path
 * @param {{method?:string, query?:object, body?:any, headers?:object, retry?:boolean}} opts
 */
async function request(path, { method = "GET", query, body, headers = {}, retry = true } = {}) {
  if (!API_CONFIG.ENABLED) throw new ApiError("Servicio no disponible.", 503, null);

  const url = buildUrl(path, query);
  const isGet = method === "GET";

  // Cache solo para GET idempotentes
  if (isGet) {
    const hit = getCached(method, url);
    if (hit !== null) {
      if (typeof __DEV__ !== "undefined" && __DEV__) console.log(`[API cache hit] ${method} ${maskUrl(url)}`);
      return hit;
    }
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  const doFetch = async () => {
    if (typeof __DEV__ !== "undefined" && __DEV__) console.log(`[API] ${method} ${maskUrl(url)} (Cliente -> Backend -> DB)`);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (typeof __DEV__ !== "undefined" && __DEV__) console.log(`[API] <- ${res.status} ${maskUrl(url)}`, Array.isArray(data) ? `array[${data.length}]` : typeof data);

    if (!res.ok) throw ApiError.fromResponse(res.status, data);
    if (isGet) setCached(method, url, data, CACHE_TTL_MS);
    return data;
  };

  const exec = async () => {
    try {
      return await doFetch();
    } catch (e) {
      if (e.name === "AbortError") throw ApiError.timeout();
      if (e instanceof ApiError) {
        // Retry solo en 408/5xx y una vez
        if (retry && (e.status === 408 || (e.status != null && e.status >= 500))) {
          await new Promise((r) => setTimeout(r, 400));
          return request(path, { method, query, body, headers, retry: false });
        }
        throw e;
      }
      if (e instanceof ValidationError) throw e;
      throw ApiError.network(e.message);
    } finally {
      clearTimeout(t);
    }
  };

  // Deduplicación: misma URL en vuelo comparte promesa
  if (isGet) return dedupGet(`${method}:${url}`, exec);
  return exec();
}

export const apiClient = {
  get: (path, query) => request(path, { method: "GET", query }),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
  query: (path, params) => request(path, { method: "GET", query: params }),
  clearCache: () => {
    const { clearCache } = require("./api.cache");
    clearCache();
  },
};

/**
 * Factory idempotente con paginación segura.
 * FIX: getById usa query ?Id= para compat con json-server (campo Id/ID, no :id)
 */
export function createResource(basePath) {
  assertSafePath(basePath);
  return {
    /** Lista con paginación por defecto (evita traer 48k boardings) */
    list: (params = {}) => {
      const p = { _limit: 50, ...params };
      if (p._limit > 100) p._limit = 100;
      return apiClient.query(basePath, p);
    },
    /** Compat: busca por ?Id= o ?ID= según recurso */
    getById: async (id) => {
      if (!id || String(id).length > 100) throw new ValidationError("Id inválido.");
      const isRole = basePath === "/roles";
      const key = isRole ? "ID" : "Id";
      const arr = await apiClient.query(basePath, { [key]: String(id) });
      return Array.isArray(arr) ? arr[0] ?? null : arr;
    },
    create: (payload) => {
      if (!payload || typeof payload !== "object") throw new ValidationError("Payload inválido.");
      return apiClient.post(basePath, payload);
    },
    update: (id, payload) => apiClient.put(`${basePath}/${encodeURIComponent(String(id))}`, payload),
    remove: (id) => apiClient.del(`${basePath}/${encodeURIComponent(String(id))}`),
    query: (params) => apiClient.query(basePath, params),
  };
}
