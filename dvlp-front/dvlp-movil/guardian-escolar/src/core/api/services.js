// [MOCK-API] Servicios — mapean openapi.json -> db.json con DTO y validación.
// Reutilización: factory + validadores + mappers. Seguridad: mensajes genéricos, no leak de schema.

import { apiClient, createResource } from "./api.client";
import { API_CONFIG, ENDPOINTS } from "./api.config";
import { ValidationError, ApiError } from "./api.errors";
import { validateEmail, validatePassword } from "./api.validators";
import { verifyPasswordAsync } from "./password.service";

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
   * Login con validación compartida web/móvil + soporte mock (json-server :3000) y real (backend :8080 /api/login).
   * Valida email/password igual que web (Validators.required + pattern), loguea todos los intentos ([Auth] logs).
   * Soporta 4 roles: admin, parent/padre, driver/conductor, student/estudiante.
   * @throws {ValidationError|ApiError}
   */
  async login(email, password) {
    const safeEmail = validateEmail(email);
    validatePassword(password);
    const isMock = API_CONFIG.BASE_URL.includes(":3000");
    // Loguear intento (todos los logues se pasan en la petición)
    const attemptLog = { email: safeEmail, timestamp: new Date().toISOString(), target: isMock ? "mock" : "backend", roles: ["admin","parent","driver","student"] };
    if (typeof __DEV__ !== "undefined" && __DEV__) console.log("[Auth] Intento login", attemptLog);

    if (isMock) {
      let persons, profiles, roles;
      try {
        persons = await apiClient.query(ENDPOINTS.persons, { Email: safeEmail });
      } catch (e) {
        if (e instanceof ValidationError) throw e;
        if (typeof __DEV__ !== "undefined" && __DEV__) console.warn("[Auth] fallo red mock persons", e);
        throw ApiError.network();
      }
      const person = Array.isArray(persons) ? persons[0] : null;
      if (!person) {
        if (typeof __DEV__ !== "undefined" && __DEV__) console.warn("[Auth] mock no person", safeEmail);
        throw new ApiError("Credenciales inválidas. Verifica tu correo y contraseña.", 401, null);
      }

      try {
        profiles = await apiClient.query(ENDPOINTS.profiles, { PersonId: person.Id });
      } catch (e) {
        if (typeof __DEV__ !== "undefined" && __DEV__) console.warn("[Auth] fallo profiles", e);
        throw ApiError.network();
      }
      const profile = Array.isArray(profiles) ? profiles[0] : null;
      if (!profile) throw new ApiError("No se pudo completar el inicio de sesión.", 401, null);

      // Usar servicio centralizado de hashing
      const hash = profile.PasswordHash || '';
      const isValid = await verifyPasswordAsync(password, hash);
      if (!isValid) {
        throw new ApiError("Credenciales inválidas. Verifica tu correo y contraseña.", 401, null);
      }

      try {
        roles = await apiClient.query(ENDPOINTS.roles, { ID: profile.RoleId });
      } catch (e) {
        if (typeof __DEV__ !== "undefined" && __DEV__) console.warn("[Auth] fallo roles", e);
        throw ApiError.network();
      }
      const role = Array.isArray(roles) ? roles[0] : null;
      const roleName = (role?.Name || "").toLowerCase();
      if (!roleName) throw new ApiError("No se pudo completar el inicio de sesión.", 500, null);
      const dto = toSessionDTO(person, profile, roleName);
      if (typeof __DEV__ !== "undefined" && __DEV__) console.log("[Auth] mock OK", { email: dto.person.email, role: dto.role, appRole: dto.appRole });
      return dto;
    } else {
      // Backend real POST /api/login con validación y logging server-side (AuthController registra todos los logues)
      const url = `${API_CONFIG.BASE_URL}/api/login`;
      if (typeof __DEV__ !== "undefined" && __DEV__) console.log(`[Auth] POST ${url} (Cliente -> Backend -> DB)`, attemptLog);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: safeEmail, password }),
          signal: controller.signal,
        });
        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }
        if (!res.ok) {
          if (typeof __DEV__ !== "undefined" && __DEV__) console.warn("[Auth] backend respondió", res.status, data);
          // Mapear validación 400 vs 401
          if (res.status === 400) throw new ValidationError(data?.message || "Datos de entrada inválidos.");
          throw ApiError.fromResponse(res.status, data);
        }
        // Backend retorna {accessToken, expiration, name, email, roles}
        const roles = Array.isArray(data.roles) ? data.roles.map(r => String(r).toLowerCase()) : [];
        const primaryRole = roles[0] || "student";
        if (typeof __DEV__ !== "undefined" && __DEV__) console.log("[Auth] backend OK", { email: data.email, roles });
        return {
          person: { id: data.personId || data.email, email: data.email, name: data.name, status: "ACTIVE" },
          profile: { id: data.personId || "", roleId: 0, campusId: "", status: "ACTIVE" },
          role: primaryRole,
          appRole: ({ admin: "student", student: "student", parent: "father", driver: "driver" }[primaryRole] || primaryRole),
          token: data.accessToken,
          raw: data,
        };
      } catch (e) {
        if (e.name === "AbortError") throw ApiError.timeout();
        if (e instanceof ValidationError || e instanceof ApiError) throw e;
        throw ApiError.network();
      } finally {
        clearTimeout(timeout);
      }
    }
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
  /** Obtiene la ruta asignada a un estudiante específico */
  async getStudentRoute(studentProfileId) {
    if (!studentProfileId) return null;

    // 1. Buscar asignación de ruta-estudiante (campo: ProfileId, RouteStopId)
    const assignments = await apiClient.query(ENDPOINTS.routeStudentAssignments, { ProfileId: studentProfileId });
    const assignment = Array.isArray(assignments) ? assignments[0] : null;
    if (!assignment?.RouteStopId) return null;

    // 2. Obtener la ruta a través de route-stops
    const routeStops = await apiClient.query(ENDPOINTS.routeStops, { Id: assignment.RouteStopId });
    const routeStop = Array.isArray(routeStops) ? routeStops[0] : null;
    if (!routeStop?.RouteId) return null;

    const routes = await apiClient.query(ENDPOINTS.routes, { Id: routeStop.RouteId });
    const route = Array.isArray(routes) ? routes[0] : null;
    if (!route) return null;

    // 3. Contar paradas de la ruta
    const allRouteStops = await apiClient.query(ENDPOINTS.routeStops, { RouteId: route.Id });
    const stopsCount = Array.isArray(allRouteStops) ? allRouteStops.length : 0;

    // 4. Obtener bus y conductor asignados
    let bus = null, driverName = null;
    try {
      const rbas = await apiClient.query(ENDPOINTS.routeBusAssignments, { RouteId: route.Id });
      const rba = Array.isArray(rbas) ? rbas[0] : null;
      if (rba?.BusId) {
        const buses = await apiClient.query(ENDPOINTS.buses, { Id: rba.BusId });
        bus = Array.isArray(buses) ? buses[0] : null;

        // El conductor está en driver-assignments vinculado por BusId
        const driverAssignments = await apiClient.query(ENDPOINTS.driverAssignments, { BusId: rba.BusId });
        const da = Array.isArray(driverAssignments) ? driverAssignments[0] : null;
        if (da?.ProfileId) {
          const profs = await apiClient.query(ENDPOINTS.profiles, { Id: da.ProfileId });
          const prof = Array.isArray(profs) ? profs[0] : null;
          if (prof?.PersonId) {
            const persons = await apiClient.query(ENDPOINTS.persons, { Id: prof.PersonId });
            const person = Array.isArray(persons) ? persons[0] : null;
            if (person) driverName = `${person.Name} ${person.LastName}`.trim();
          }
        }
      }
    } catch {}

    return {
      ...route,
      stopsCount,
      Plate: bus?.Plate || null,
      driverName,
    };
  },

  /** Rutas con conteo de paradas + bus/placa/conductor reales de db.json */
  async getRoutesWithStops(campusId, opts = {}) {
    const limit = Math.min(opts.limit ?? 50, 100);
    const routes = campusId
      ? await apiClient.query(ENDPOINTS.routes, { CampusId: campusId, _limit: limit })
      : await apiClient.query(ENDPOINTS.routes, { _limit: limit });
    const routeStops = await apiClient.query(ENDPOINTS.routeStops, { _limit: 100 });
    const byRoute = new Map();
    for (const rs of routeStops) byRoute.set(rs.RouteId, (byRoute.get(rs.RouteId) || 0) + 1);
    // Enriquecer primera ruta con bus/placa/conductor reales para RouteInfoCard
    const enriched = await Promise.all(routes.slice(0, 5).map(async (r) => {
      let bus = null, driverName = null;
      try {
        const rbas = await apiClient.query(ENDPOINTS.routeBusAssignments, { RouteId: r.Id });
        const rba = Array.isArray(rbas) ? rbas[0] : null;
        if (rba?.BusId) {
          const buses = await apiClient.query(ENDPOINTS.buses, { Id: rba.BusId });
          bus = Array.isArray(buses) ? buses[0] : null;

          const driverAssignments = await apiClient.query(ENDPOINTS.driverAssignments, { BusId: rba.BusId });
          const da = Array.isArray(driverAssignments) ? driverAssignments[0] : null;
          if (da?.ProfileId) {
            const profs = await apiClient.query(ENDPOINTS.profiles, { Id: da.ProfileId });
            const prof = Array.isArray(profs) ? profs[0] : null;
            if (prof?.PersonId) {
              const persons = await apiClient.query(ENDPOINTS.persons, { Id: prof.PersonId });
              const person = Array.isArray(persons) ? persons[0] : null;
              if (person) driverName = `${person.Name} ${person.LastName}`.trim();
            }
          }
        }
      } catch {}
      return { ...r, stopsCount: byRoute.get(r.Id) || 0, Plate: bus?.Plate || null, driverName };
    }));
    // Resto sin enriquecer
    const rest = routes.slice(5).map((r) => ({ ...r, stopsCount: byRoute.get(r.Id) || 0 }));
    return [...enriched, ...rest];
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
