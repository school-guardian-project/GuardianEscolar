// [MOCK-API] Mappers json-server -> CardList ItemFields
// Cada CardType espera keys definidas en ITEM_FIELDS de card-list.ts

export function mapEstudiante(person: any, profile: any): any {
  return {
    id: person.Id,
    profileId: profile?.Id,
    nombre: `${person.Name} ${person.LastName}`.trim(),
    nombres: person.Name,
    apellidos: person.LastName,
    identificacion: person.IdentificationNumber,
    tipoId: person.IdentificationType,
    telefono: `+57 ${person.Phone}`,
    correo: person.Email,
    direccion: person.ResidenceAddress,
    fechaNac: person.DateBirth,
    curso: '—', // json-server no tiene curso, placeholder
  };
}

export function mapConductor(person: any, profile: any, license: any): any {
  return {
    id: person.Id,
    profileId: profile?.Id,
    nombre: `${person.Name} ${person.LastName}`.trim(),
    nombres: person.Name,
    apellidos: person.LastName,
    identificacion: person.IdentificationNumber,
    tipoId: person.IdentificationType,
    telefono: `+57 ${person.Phone}`,
    correo: person.Email,
    licencia: license?.LicenseNumber ?? '—',
    vencLicencia: license?.LicenseExpirationDate ?? '—',
    fechaNac: person.DateBirth,
    direccion: person.ResidenceAddress,
  };
}

export function mapFamilia(family: any, parents: string[] = [], students: string[] = []): any {
  return {
    id: family.Id,
    nombre: family.Name,
    observaciones: family.Observations,
    acudiente: parents.length ? parents.join(', ') : '—',
    estudiante: students.length ? students.join(', ') : '—',
    telefono: '—',
  };
}

export function mapBus(bus: any, model: any, brand: any, driverName: string | null): any {
  return {
    id: bus.Id,
    matricula: bus.Plate,
    placa: bus.Plate,
    conductor: driverName ?? '—',
    marca: brand?.Name ?? '—',
    modelo: model?.Name ?? '—',
    capacidad: String(bus.Capacity),
    gps: '—',
    soat: bus.SoatValidity,
  };
}

export function mapRuta(route: any): any {
  return {
    id: route.Id,
    nombre: route.Name,
    sector: route.TargetSector,
    destino: route.TargetSector,
    destino_final: route.TargetSector,
    horaInicio: '06:30',
    horaFin: '08:00',
  };
}

export function mapParada(stop: any, city: any, studentNames: string[] = []): any {
  return {
    id: stop.Id,
    nombre: stop.Address,
    estudiante: studentNames.length ? studentNames.join(', ') : '—',
    direccion: stop.Address,
    ciudad: city?.Name ?? '—',
    latitud: String(stop.Latitude),
    longitud: String(stop.Longitude),
  };
}

export function mapSchool(school: any): any {
  return {
    id: school.Id,
    nombre: school.Name,
    direccion: school.Address,
    telefono: school.Phone,
    correo: school.Email,
    web: school.Website,
  };
}
