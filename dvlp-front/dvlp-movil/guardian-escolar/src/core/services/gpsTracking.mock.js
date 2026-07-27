export const mockGPSData = {
  estudiante: {
    route: {
      name: "Ruta Centro",
      driverName: "Carlos Pérez",
      plate: "ABC-123",
      schedule: "06:00 AM - 07:30 AM",
      stopsCount: 12,
      finalDestination: "Colegio San José",
    },
    markers: [{ id: "self", lat: 2.9273, lng: -75.2819, label: "Tú" }],
  },
  conductor: {
    route: {
      name: "Ruta Centro",
      driverName: "Carlos Pérez", // revisar: ¿debería mostrarse distinto para el propio conductor?
      plate: "ABC-123",
      schedule: "06:00 AM - 07:30 AM",
      stopsCount: 12,
      finalDestination: "Colegio San José",
    },
    markers: [
      { id: "s1", lat: 2.928, lng: -75.281, label: "Estudiante 1" },
      { id: "s2", lat: 2.926, lng: -75.283, label: "Estudiante 2" },
      { id: "s3", lat: 2.9295, lng: -75.28, label: "Estudiante 3" },
    ],
  },
  padre: {
    route: {
      name: "Ruta Centro",
      driverName: "Carlos Pérez",
      plate: "ABC-123",
      schedule: "06:00 AM - 07:30 AM",
      stopsCount: 12,
      finalDestination: "Colegio San José",
    },
    markers: [{ id: "child", lat: 2.9285, lng: -75.2825, label: "Tu hijo" }],
  },
};