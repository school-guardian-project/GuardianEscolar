import { getRouteApi } from "./routeApi";
import { getFleetApi } from "./fleetApi";
import { getLinkedStudents } from "./familyService";

export async function resolveRouteForRole(role, session) {
  if (!session?.profileId) {
    return { route: null, note: "No se pudo verificar la ruta asignada." };
  }

  if (role === "student") {
    const route = await getAssignedRoute(session.profileId);
    return { route, note: route ? null : "Aún no tienes una ruta asignada." };
  }

  if (role === "driver") {
    const today = await getRouteApi(`/routes/today?driverId=${session.profileId}`);
    if (today?.status === "ACTIVE" && today.route?.id) {
      return { route: today.route, note: null };
    }
    if (today?.status === "SCHEDULED" && today.nextOccurrence) {
      const next = new Date(today.nextOccurrence).toLocaleString("es-CO", {
        weekday: "long", hour: "2-digit", minute: "2-digit",
      });
      return { route: today.route?.id ? today.route : null, note: `Tu próximo recorrido es el ${next}.` };
    }
    if (today?.status === "NO_SCHEDULE" && today.route?.id) {
      return { route: today.route, note: "Tu ruta y bus están asignados, pero la ruta aún no tiene horarios activos." };
    }
    if (today?.status === "NO_ROUTE") {
      const bus = await getAssignedBus(session.profileId);
      return {
        route: null,
        bus,
        note: bus ? "Tienes un bus asignado, pero aún no tiene una ruta activa asignada." : "No tienes un bus asignado.",
      };
    }
    return { route: null, note: "No hay una ruta asignada." };
  }

  if (role === "parent") {
    const [student] = await getLinkedStudents(session);
    if (!student?.profileId) {
      return { route: null, note: "No hay estudiantes vinculados a tu cuenta." };
    }
    const route = await getAssignedRoute(student.profileId);
    return { route, note: route ? null : "El estudiante aún no tiene una ruta asignada." };
  }

  if (role === "admin") {
    const routes = await getRouteApi("/routes");
    const first = Array.isArray(routes) ? routes.find(route => route?.id) : null;
    if (!first) return { route: null, note: "No hay una ruta asignada." };
    const route = await getRouteApi(`/routes/${first.id}`);
    return { route, note: route ? null : "No hay una ruta asignada." };
  }

  throw new Error("Unsupported route role");
}

async function getAssignedBus(profileId) {
  try {
    const assigned = await getFleetApi(`/buses/assigned/${profileId}`);
    if (!assigned?.id) throw new Error("El servicio de flota devolvió una asignación sin ID de bus.");
    const bus = await getFleetApi(`/buses/${assigned.id}`);
    if (bus?.id !== assigned.id) throw new Error("El detalle del bus no corresponde a la asignación del conductor.");
    return bus;
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
}

async function getAssignedRoute(profileId) {
  try {
    return await getRouteApi(`/routes/student/${profileId}`);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
}
