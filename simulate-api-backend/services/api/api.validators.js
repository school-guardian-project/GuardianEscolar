// [MOCK-API] Validadores y sanitizadores reutilizables (DRY + seguridad)
import { ValidationError } from "./api.errors";

// Whitelist de campos filtrables por recurso (evita inyección de query params arbitrarios)
const ALLOWED_FILTERS = {
  "/persons": new Set(["Id", "Email", "Name", "LastName", "Status"]),
  "/profiles": new Set(["Id", "PersonId", "RoleId", "CampuseId", "Status"]),
  "/roles": new Set(["ID", "Name", "Status"]),
  "/routes": new Set(["Id", "CampusId", "Name", "Status"]),
  "/route-stops": new Set(["Id", "RouteId", "StopId", "Status"]),
  "/stops": new Set(["Id", "CityId", "SchoolId", "Status"]),
  "/families": new Set(["Id", "Name", "Status"]),
  "/family-members": new Set(["Id", "FamilyId", "ProfileId", "RelationshipType", "Status"]),
  "/buses": new Set(["Id", "CampusId", "Plate", "Status"]),
  "/boardings": new Set(["Id", "RouteExecutionId", "ProfileId", "RouteStopId"]),
  "/alerts": new Set(["Id", "RouteExecutionId", "AlertTypeId", "ProfileId"]),
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LEN = 254;

export function validateEmail(email) {
  if (typeof email !== "string") throw new ValidationError("Correo inválido.");
  const v = email.trim();
  if (!v || v.length > MAX_LEN || !EMAIL_RE.test(v)) throw new ValidationError("Correo con formato inválido.");
  return v.toLowerCase();
}

export function validatePassword(password) {
  if (typeof password !== "string") throw new ValidationError("Contraseña inválida.");
  if (password.length < 1) throw new ValidationError("Contraseña requerida.");
  if (password.length > 128) throw new ValidationError("Contraseña demasiado larga.");
  return password;
}

/**
 * Sanitiza y valida query params contra whitelist. Evita `?__proto__` o campos no permitidos.
 * @returns {Record<string,string>} params seguros
 */
const PAGINATION = new Set(["_page", "_limit", "_sort", "_order", "q"]);

export function sanitizeQuery(path, params = {}) {
  const allowed = ALLOWED_FILTERS[path];
  if (!allowed) {
    // Recurso no listado: solo permitir paginación/ordenamiento seguro
    const out = {};
    for (const [k, v] of Object.entries(params)) {
      if (!PAGINATION.has(k)) continue;
      out[k] = sanitizeValue(v);
    }
    return out;
  }
  const out = {};
  for (const [k, v] of Object.entries(params)) {
    if (PAGINATION.has(k)) {
      out[k] = sanitizeValue(v);
      continue;
    }
    if (!allowed.has(k)) throw new ValidationError(`Filtro no permitido: ${k}`);
    out[k] = sanitizeValue(v);
  }
  return out;
}

function sanitizeValue(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  if (s.length > 200) throw new ValidationError("Valor de filtro demasiado largo.");
  // Bloquear intentos de inyección / proto pollution
  if (/__proto__|constructor|prototype/i.test(s)) throw new ValidationError("Valor no permitido.");
  return s;
}

export function assertSafePath(path) {
  if (!path.startsWith("/")) throw new ValidationError("Ruta inválida.");
  if (path.includes("..") || path.includes("//")) throw new ValidationError("Ruta no permitida.");
}
