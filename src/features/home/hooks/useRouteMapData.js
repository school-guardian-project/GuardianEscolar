import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useSession from "@core/hooks/useSession";
import { getSession } from "@core/services/authService";
import { getRouteApi } from "@core/services/routeApi";
import { getFleetApi } from "@core/services/fleetApi";
import { getUserApi } from "@core/services/userApi";

function normalizeStops(route) {
  const stops = Array.isArray(route?.stops) ? route.stops : [];

  return stops
    .map((stop, index) => {
      const latitude = Number(stop?.latitude);
      const longitude = Number(stop?.longitude);
      const hasCoordinates =
        stop?.latitude != null && stop.latitude !== "" &&
        stop?.longitude != null && stop.longitude !== "";
      const sequence = Number(stop?.orderSequence);

      return {
        id: stop?.id ?? index,
        name: stop?.name ?? "",
        address: stop?.address ?? "",
        orderSequence: Number.isFinite(sequence) ? sequence : index,
        originalIndex: index,
        latitude,
        longitude,
        hasCoordinates,
      };
    })
    .filter(
      (stop) =>
        stop.hasCoordinates &&
        Number.isFinite(stop.latitude) &&
        Number.isFinite(stop.longitude) &&
        stop.latitude >= -90 &&
        stop.latitude <= 90 &&
        stop.longitude >= -180 &&
        stop.longitude <= 180
    )
    .sort((a, b) => a.orderSequence - b.orderSequence || a.originalIndex - b.originalIndex);
}

async function getRouteForRole(role, profileId, selectedStudentId) {
  if (role === "student") {
    return getRouteApi(`/routes/student/${profileId}`);
  }

  if (role === "driver") {
    const today = await getRouteApi(`/routes/today?driverId=${profileId}`);
    return today?.status === "ACTIVE" ? today.route : null;
  }

  if (role === "father") {
    if (!selectedStudentId) return null;
    return getRouteApi(`/routes/me/students/${selectedStudentId}`);
  }

  return null;
}

export default function useRouteMapData() {
  const { role } = useSession();
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardianStudents, setGuardianStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [status, setStatus] = useState("");

  const loadRoute = useCallback(async (isActive) => {
    setLoading(true);

    try {
      const session = await getSession();
      let studentId = selectedStudentId;
      if (session && role === "father") {
        const students = await getUserApi("/families/me/students");
        if (!isActive()) return;
        const ids = Array.isArray(students) ? students.map((item) => item?.profileId).filter(Boolean) : [];
        setGuardianStudents(ids);
        if (ids.length === 1 && !studentId) {
          studentId = ids[0];
          setSelectedStudentId(studentId);
        }
        if (ids.length === 0) {
          setStatus("No hay estudiantes asociados a este acudiente.");
          setRouteStops([]); setRouteInfo(null); return;
        }
        if (!studentId || !ids.includes(studentId)) {
          setStatus("Selecciona un estudiante para consultar su ruta.");
          setRouteStops([]); setRouteInfo(null); return;
        }
      }
      const route = session ? await getRouteForRole(role, session.profileId, studentId) : null;

      if (!isActive()) return;

      if (!route) {
        setRouteStops([]);
        setRouteInfo(null);
        setStatus(role === "father" ? "El estudiante seleccionado no tiene una ruta asignada." : "No hay una ruta asignada.");
        return;
      }

      const stops = normalizeStops(route);
      let driverName = "";
      let plate = "";

      if (role === "driver") {
        try {
          const buses = await getFleetApi("/buses");
          const bus = buses.find((item) => item.campuseId === route.campuseId);
          plate = bus?.plate ?? "";
          driverName = bus?.driverName ?? "";
        } catch (error) {
          console.error("Error loading bus info:", error);
        }
      }

      if (!isActive()) return;

      setRouteStops(stops);
      setStatus(stops.length ? "Geometría vial no disponible para esta ruta." : "La ruta no tiene paradas válidas.");
      setRouteInfo({
        routeName: route.name,
        driverName,
        plate,
        schedule:
          route.startTime && route.endTime
            ? `${route.startTime} - ${route.endTime}`
            : "",
        stopsCount:
          route.stopsCount != null && route.stopsCount !== ""
            ? String(route.stopsCount)
            : stops.length > 0
              ? String(stops.length)
              : "—",
        finalDestination: route.targetSector ?? "",
      });
    } catch (error) {
      console.error("Error loading route info:", error);
      if (isActive()) {
        setRouteStops([]);
        setRouteInfo(null);
        setStatus("No fue posible verificar la ruta asignada.");
      }
    } finally {
      if (isActive()) setLoading(false);
    }
  }, [role, selectedStudentId]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadRoute(() => active);

      return () => {
        active = false;
      };
    }, [loadRoute])
  );

  return { routeInfo, routeStops, loading, guardianStudents, selectedStudentId, setSelectedStudentId, status };
}
