// [MOCK-API] Validadores compartidos web — DRY con móvil
import { MockValidationError } from './mock-api.errors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALLOWED: Record<string, Set<string>> = {
  '/persons': new Set(['Id', 'Email', 'Name', 'Status']),
  '/profiles': new Set(['Id', 'PersonId', 'RoleId', 'CampuseId', 'Status']),
  '/roles': new Set(['ID', 'Name', 'Status']),
  '/routes': new Set(['Id', 'CampusId', 'Status']),
  '/buses': new Set(['Id', 'CampusId', 'Plate', 'Status']),
  '/route-student-assignments': new Set(['Id', 'ProfileId', 'StudentProfileId', 'RouteId', 'RouteStopId', 'Status']),
  '/route-bus-assignments': new Set(['Id', 'RouteId', 'BusId', 'DriverProfileId', 'Status']),
  '/family-members': new Set(['Id', 'FamilyId', 'ProfileId', 'RelationshipType', 'Status']),
  '/families': new Set(['Id', 'Name', 'Status']),
};

export function validateEmail(v: string): string {
  if (!v || typeof v !== 'string') throw new MockValidationError('Correo inválido.');
  const s = v.trim().toLowerCase();
  if (s.length > 254 || !EMAIL_RE.test(s)) throw new MockValidationError('Correo con formato inválido.');
  return s;
}
export function validatePassword(v: string): string {
  if (!v || typeof v !== 'string' || v.length > 128) throw new MockValidationError('Contraseña inválida.');
  return v;
}
const PAGINATION = new Set(['_limit', '_page', '_sort', '_order', '_start', '_end', 'q']);

export function sanitizeQuery(path: string, params: Record<string, any> = {}): Record<string, string> {
  const allowed = ALLOWED[path];
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    // PAGINATION siempre permitida
    if (PAGINATION.has(k)) {
      // ok
    } else if (allowed) {
      if (!allowed.has(k)) throw new MockValidationError(`Filtro no permitido: ${k}`);
    } else {
      // path no está en whitelist: permitir cualquier clave segura (json-server flexible) — solo valida valor
    }
    const s = String(v).trim();
    if (s.length > 200) throw new MockValidationError('Valor demasiado largo.');
    if (/__proto__|constructor/i.test(s)) throw new MockValidationError('Valor no permitido.');
    out[k] = s;
  }
  return out;
}
