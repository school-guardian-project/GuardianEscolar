// [MOCK-API] Servicios — mapean openapi.json -> db.json con DTO y validación.
// Reutilización: factory + validadores + mappers. Seguridad: mensajes genéricos, no leak de schema.

import { apiClient, createResource } from "./api.client";
import { ENDPOINTS } from "./api.config";
import { ValidationError, ApiError } from "./api.errors";
import { validateEmail, validatePassword } from "./api.validators";

// ----- Recursos genéricos -----
export const permissionService = createResource(ENDPOINTS.permissions);
export const profileService = createResource(ENDPOINTS.profiles);
export const roleService = createResource(ENDPOINTS.roles);
export const personService = createResource(ENDPOINTS.persons);
export const familyService = createResource(ENDPOINTS.families);
export const familyMemberService = createResource(ENDPOINTS.familyMembers);
export const busService = createResource(ENDPOINTS.buses);
export const routeService = createResource(ENDPOINTS.routes);
export const routeStopService = createResource(ENDPOINTS.routeStops);
export const stopService = createResource(ENDPOINTS.stops);
export const boardingService = createResource(ENDPOINTS.boardings);
export const alertService = createResource(ENDPOINTS.alerts);
export const schoolService = createResource(ENDPOINTS.schools);
export const schoolCampusService = createResource(ENDPOINTS.schoolCampuses);
export const gpsDeviceService = createResource(ENDPOINTS.gpsDevices);
export const gpsLocationService = createResource(ENDPOINTS.gpsLocations);
export const routeExecutionService = createResource(ENDPOINTS.routeExecutions);

// ----- Mappers DTO (desacoplan DB del dominio) -----
function toSessionDTO(person, profile, roleName) {
  const roleMap = { admin: "student", student: "student", parent: "father", driver: "driver" };
  return {
    person: { id: person.Id, email: person.Email, name: `${person.Name} ${person.LastName}`.trim(), status: person.Status },
    profile: { id: profile.Id, roleId: profile.RoleId, campusId: profile.CampuseId, status: profile.Status },
    role: roleName,
    appRole: roleMap[roleName] || "student",
    token: `mock-jwt-${profile.Id}-${Date.now()}`,
  };
}

// ----- Auth -----
export const authService = {
  /**
   * Login simulado: persons -> profiles -> roles. Mensaje genérico por seguridad (no revela si email existe).
   * @throws {ValidationError|ApiError}
   */
  async login(email, password) {
    const safeEmail = validateEmail(email);
    validatePassword(password);

    let persons, profiles, roles;
    try {
      persons = await apiClient.query(ENDPOINTS.persons, { Email: safeEmail });
    } catch (e) {
      if (e instanceof ValidationError) throw e;
      throw ApiError.network();
    }
    const person = Array.isArray(persons) ? persons[0] : null;
    if (!person) throw new ApiError("Credenciales inválidas. Verifica tu correo y contraseña.", 401, null);

    try {
      profiles = await apiClient.query(ENDPOINTS.profiles, { PersonId: person.Id });
    } catch {
      throw ApiError.network();
    }
    const profile = Array.isArray(profiles) ? profiles[0] : null;
    if (!profile) throw new ApiError("No se pudo completar el inicio de sesión.", 401, null);

    try {
      roles = await apiClient.query(ENDPOINTS.roles, { ID: profile.RoleId });
    } catch {
      throw ApiError.network();
    }
    const role = Array.isArray(roles) ? roles[0] : null;
    const roleName = (role?.Name || "").toLowerCase();
    if (!roleName) throw new ApiError("No se pudo completar el inicio de sesión.", 500, null);

    return toSessionDTO(person, profile, roleName);
  },

  /** Demo helper: primer perfil del rol */
  async loginAs(roleName) {
    if (!roleName || typeof roleName !== "string") throw new ValidationError("Rol inválido.");
    const roles = await apiClient.get(ENDPOINTS.roles);
    const target = roles.find((r) => r.Name.toLowerCase() === roleName.toLowerCase());
    if (!target) throw new ApiError("Rol no disponible.", 404, null);
    const profiles = await apiClient.query(ENDPOINTS.profiles, { RoleId: target.ID });
    const profile = profiles[0];
    if (!profile) throw new ApiError("Sin usuarios para ese rol.", 404, null);
    const persons = await apiClient.query(ENDPOINTS.persons, { Id: profile.PersonId });
    const person = Array.isArray(persons) ? persons[0] : persons;
    if (!person?.Email) throw new ApiError("Usuario sin correo.", 500, null);
    return this.login(person.Email, "demo");
  },
};

// ----- Dominio -----
export const dashboardService = {
  /** Rutas con conteo de paradas — paginado y con cache del client */
  async getRoutesWithStops(campusId, opts = {}) {
    const limit = Math.min(opts.limit ?? 50, 100);
    const routes = campusId
      ? await apiClient.query(ENDPOINTS.routes, { CampusId: campusId, _limit: limit })
      : await apiClient.query(ENDPOINTS.routes, { _limit: limit });
    const routeStops = await apiClient.query(ENDPOINTS.routeStops, { _limit: 100 });
    const byRoute = new Map();
    for (const rs of routeStops) byRoute.set(rs.RouteId, (byRoute.get(rs.RouteId) || 0) + 1);
    return routes.map((r) => ({ ...r, stopsCount: byRoute.get(r.Id) || 0 }));
  },

  async getFamilyForProfile(profileId) {
    if (!profileId || String(profileId).length > 100) throw new ValidationError("Perfil inválido.");
    const members = await apiClient.query(ENDPOINTS.familyMembers, { ProfileId: String(profileId) });
    if (!members?.length) return null;
    const fams = await apiClient.query(ENDPOINTS.families, { Id: members[0].FamilyId });
    const fam = Array.isArray(fams) ? fams[0] : fams;
    return fam ? { family: fam, membership: members[0] } : null;
  },
};
