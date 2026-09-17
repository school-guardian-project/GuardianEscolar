// [MOCK-API] DataService para CardList — Cliente -> json-server :3000 -> DB
// Reutiliza MockApiService + mappers. Cache y paginación seguras.

import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, map, switchMap, catchError, Subject, tap } from 'rxjs';
import { MockApiService } from './mock-api.service';
import { environment } from '../../../environments/environment';
import { clearMockCache } from './mock-api.cache';
import {
  mapEstudiante, mapConductor, mapFamilia, mapBus, mapRuta, mapParada, mapSchool,
} from './card-list.mapper';

@Injectable({ providedIn: 'root' })
export class CardListDataService {
  private api = inject(MockApiService);
  private isMock = environment.apiUrl.includes(':3000');
  private refreshSubject = new Subject<string>();
  refresh$ = this.refreshSubject.asObservable();

  isMockEnabled(): boolean { return this.isMock; }
  triggerRefresh(type: string): void { this.refreshSubject.next(type); }
  private genId(prefix: string): string { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }

  private getCurrentCampusId(): string | null {
    try { return sessionStorage.getItem('user_campuse_id') || localStorage.getItem('user_campuse_id'); } catch { return null; }
  }

  getByType(type: string): Observable<any[]> {
    if (!this.isMock) return of([]);
    switch (type) {
      case 'estudiante': return this.getEstudiantes();
      case 'conductor': return this.getConductores();
      case 'familia': return this.getFamilias();
      case 'acudiente': return this.getAcudientes();
      case 'bus': return this.getBuses();
      case 'ruta': return this.getRutas();
      case 'parada': return this.getParadas();
      case 'schools': return this.getSchools();
      case 'admins': return this.getAdmins();
      default: return of([]);
    }
  }

  getEstudiantes(): Observable<any[]> {
    const campusId = this.getCurrentCampusId();
    const params: any = { RoleId: 2, _limit: 50, _sort: 'Id', _order: 'desc' };
    if (campusId) params.CampuseId = campusId;
    return this.api.get<any[]>('/profiles', params).pipe(
      switchMap((profiles) => {
        if (!profiles.length) return of([]);
        // batch persons por Id (json-server no soporta _in, hacemos forkJoin limitado)
        const limited = profiles.slice(0, 20);
        const obs = limited.map(p =>
          this.api.get<any[]>('/persons', { Id: p.PersonId }).pipe(map(arr => ({ p, person: arr[0] })))
        );
        return forkJoin(obs).pipe(map(list => list.filter(x => x.person).map(x => mapEstudiante(x.person, x.p))));
      }),
      catchError(() => of([]))
    );
  }

  private getConductores(): Observable<any[]> {
    const campusId = this.getCurrentCampusId();
    const params: any = { RoleId: 4, _limit: 50, _sort: 'Id', _order: 'desc' };
    if (campusId) params.CampuseId = campusId;
    return this.api.get<any[]>('/profiles', params).pipe(
      switchMap((profiles) => {
        if (!profiles.length) return of([]);
        const limited = profiles.slice(0, 20);
        const obs = limited.map(p =>
          forkJoin({
            person: this.api.get<any[]>('/persons', { Id: p.PersonId }).pipe(map(a => a[0])),
            lic: this.api.get<any[]>('/driver-licenses', { ProfileId: p.Id }).pipe(map(a => a[0]), catchError(() => of(null))),
          }).pipe(map(({ person, lic }) => ({ p, person, lic })))
        );
        return forkJoin(obs).pipe(map(list => list.filter(x => x.person).map(x => mapConductor(x.person, x.p, x.lic))));
      }),
      catchError(() => of([]))
    );
  }

  getAcudientes(): Observable<any[]> {
    const campusId = this.getCurrentCampusId();
    const params: any = { RoleId: 3, _limit: 50, _sort: 'Id', _order: 'desc' };
    if (campusId) params.CampuseId = campusId;
    return this.api.get<any[]>('/profiles', params).pipe(
      switchMap((profiles) => {
        const limited = profiles.slice(0, 20);
        const obs = limited.map(p => this.api.get<any[]>('/persons', { Id: p.PersonId }).pipe(map(a => ({ p, person: a[0] }))));
        return obs.length ? forkJoin(obs).pipe(map(list => list.filter(x => x.person).map(x => mapEstudiante(x.person, x.p)))) : of([]);
      }),
      catchError(() => of([]))
    );
  }

  private getAdmins(): Observable<any[]> {
    const campusId = this.getCurrentCampusId();
    const params: any = { RoleId: 1, _limit: 20, _sort: 'Id', _order: 'desc' };
    if (campusId) params.CampuseId = campusId;
    return this.api.get<any[]>('/profiles', params).pipe(
      switchMap((profiles) => {
        const obs = profiles.map(p => this.api.get<any[]>('/persons', { Id: p.PersonId }).pipe(map(a => ({ p, person: a[0] }))));
        return obs.length ? forkJoin(obs).pipe(map(list => list.filter(x => x.person).map(x => mapEstudiante(x.person, x.p)))) : of([]);
      }),
      catchError(() => of([]))
    );
  }

  private getFamilias(): Observable<any[]> {
    return this.api.get<any[]>('/families', { _limit: 1000 }).pipe(
      map(arr => [...arr].reverse().slice(0, 20).map(mapFamilia)),
      catchError(() => of([]))
    );
  }

  private getBuses(): Observable<any[]> {
    return this.api.get<any[]>('/buses', { _limit: 20 }).pipe(
      switchMap((buses) => {
        if (!buses.length) return of([]);
        const obs = buses.slice(0, 10).map(b =>
          forkJoin({
            model: b.ModelId ? this.api.get<any[]>('/models', { Id: b.ModelId }).pipe(map(a => a[0]), catchError(() => of(null))) : of(null),
            driverName: this.resolveDriverName(b.Id),
          }).pipe(
            switchMap(({ model, driverName }) => {
              const brandObs = model?.BrandId ? this.api.get<any[]>('/brands', { Id: model.BrandId }).pipe(map(a => a[0]), catchError(() => of(null))) : of(null);
              return brandObs.pipe(map(brand => mapBus(b, model, brand, driverName)));
            })
          )
        );
        return forkJoin(obs);
      }),
      catchError(() => of([]))
    );
  }

  private resolveDriverName(busId: string): Observable<string | null> {
    return this.api.get<any[]>('/driver-assignments', { BusId: busId }).pipe(
      switchMap(assignments => {
        const da = Array.isArray(assignments) ? assignments[0] : null;
        if (!da?.ProfileId) return of(null);
        return this.api.get<any[]>('/profiles', { Id: da.ProfileId }).pipe(
          switchMap(profiles => {
            const prof = Array.isArray(profiles) ? profiles[0] : null;
            if (!prof?.PersonId) return of(null);
            return this.api.get<any[]>('/persons', { Id: prof.PersonId }).pipe(
              map(persons => {
                const person = Array.isArray(persons) ? persons[0] : null;
                return person ? `${person.Name} ${person.LastName}`.trim() : null;
              })
            );
          })
        );
      }),
      catchError(() => of(null))
    );
  }

  private getRutas(): Observable<any[]> {
    return this.api.get<any[]>('/routes', { _limit: 20 }).pipe(
      map(arr => arr.map(mapRuta)),
      catchError(() => of([]))
    );
  }

  private getParadas(): Observable<any[]> {
    return forkJoin({
      stops: this.api.get<any[]>('/stops', { _limit: 20 }).pipe(catchError(() => of([]))),
      routeStops: this.api.get<any[]>('/route-stops', {}).pipe(catchError(() => of([]))),
      assignments: this.api.get<any[]>('/route-student-assignments', {}).pipe(catchError(() => of([]))),
      profiles: this.api.get<any[]>('/profiles', {}).pipe(catchError(() => of([]))),
      persons: this.api.get<any[]>('/persons', {}).pipe(catchError(() => of([]))),
      cities: this.api.get<any[]>('/cities', {}).pipe(catchError(() => of([]))),
    }).pipe(
      map(({ stops, routeStops, assignments, profiles, persons, cities }) => {
        const stopsArr = Array.isArray(stops) ? stops.slice(0, 10) : [];
        if (!stopsArr.length) return [];

        const profMap = new Map<string, any>((Array.isArray(profiles) ? profiles : []).map((p: any) => [p.Id, p]));
        const personMap = new Map<string, any>((Array.isArray(persons) ? persons : []).map((p: any) => [p.Id, p]));
        const cityMap = new Map<string, any>((Array.isArray(cities) ? cities : []).map((c: any) => [c.Id, c]));
        const rsArr = Array.isArray(routeStops) ? routeStops : [];
        const assignArr = Array.isArray(assignments) ? assignments : [];

        return stopsArr.map(s => {
          const city = s.CityId ? cityMap.get(s.CityId) ?? null : null;

          const stopRouteStopIds = rsArr.filter((rs: any) => rs.StopId === s.Id).map((rs: any) => rs.Id);
          const stopAssignments = assignArr.filter((a: any) => stopRouteStopIds.includes(a.RouteStopId));
          const profileIds = [...new Set(stopAssignments.map((a: any) => a.ProfileId).filter(Boolean))];
          const studentNames: string[] = profileIds.slice(0, 5).map((pid: string) => {
            const prof = profMap.get(pid);
            if (!prof?.PersonId) return null;
            const person = personMap.get(prof.PersonId);
            return person ? `${person.Name} ${person.LastName}`.trim() : null;
          }).filter((n): n is string => !!n);

          return mapParada(s, city, studentNames);
        });
      }),
      catchError(() => of([]))
    );
  }

  private getSchools(): Observable<any[]> {
    return this.api.get<any[]>('/schools', { _limit: 10 }).pipe(
      map(arr => arr.map(mapSchool)),
      catchError(() => of([]))
    );
  }

  // ── CRUD (Cliente -> API :3000 -> DB) ─────────────────────────────────────
  create(type: string, formData: Record<string, any>): Observable<any> {
    if (!this.isMock) return of(null);
    // estudiantes/conductores/acudientes/admins requieren persons+profiles
    const roleMap:any={ estudiante:2, acudiente:3, conductor:4, admins:1 };
    if (roleMap[type]) return this.createEstudiante(formData, roleMap[type]);
    // familia: crear familia + asociar miembros si se seleccionaron
    if (type === 'familia' || type === 'familias') {
      const payload = this.toCreatePayload(type, formData);
      const withIds = { id: payload.Id ?? payload.id, ...payload };
      if (!withIds.id && withIds.Id) withIds.id = withIds.Id;
      if (!withIds.Id && withIds.id) withIds.Id = withIds.id;
      return this.api.post<any>('/families', withIds).pipe(
        switchMap(family => {
          const familyId = (family as any).Id || (family as any).id;
          const tasks: Observable<any>[] = [];
          const acudienteVal = formData['acudiente'];
          const estudianteVal = formData['estudiante'];
          if (acudienteVal) {
            tasks.push(this.findProfileByDisplay(acudienteVal, 3).pipe(
              switchMap(profile => {
                if (!profile) return of(null);
                const fmId = this.genId('family-member');
                return this.api.post<any>('/family-members', { id: fmId, Id: fmId, FamilyId: familyId, ProfileId: profile.Id, RelationshipType: 'PARENT', Status: 'ACTIVE' });
              }), catchError(() => of(null))
            ));
          }
          if (estudianteVal) {
            tasks.push(this.findProfileByDisplay(estudianteVal, 2).pipe(
              switchMap(profile => {
                if (!profile) return of(null);
                const fmId = this.genId('family-member');
                return this.api.post<any>('/family-members', { id: fmId, Id: fmId, FamilyId: familyId, ProfileId: profile.Id, RelationshipType: 'STUDENT', Status: 'ACTIVE' });
              }), catchError(() => of(null))
            ));
          }
          if (tasks.length) return forkJoin(tasks).pipe(map(() => family));
          return of(family);
        }),
        tap(() => { clearMockCache(); this.triggerRefresh(type); }),
        catchError(() => of(null))
      );
    }
    const payload = this.toCreatePayload(type, formData);
    const endpoint = this.endpointFor(type);
    if (!endpoint) return of(null);
    // json-server requiere `id` + `Id` para que createId no falle
    const withIds = { id: payload.Id ?? payload.id, ...payload };
    if (!withIds.id && withIds.Id) withIds.id = withIds.Id;
    if (!withIds.Id && withIds.id) withIds.Id = withIds.id;
    return this.api.post<any>(endpoint, withIds).pipe(
      tap(() => { clearMockCache(); this.triggerRefresh(type); }),
      catchError(() => of(null))
    );
  }

  private findProfileByDisplay(display: string, roleId: number): Observable<any | null> {
    const val = String(display).trim();
    return this.api.get<any[]>('/persons', { Email: val }).pipe(
      switchMap(persons => {
        if (persons[0]) {
          return this.api.get<any[]>('/profiles', { PersonId: persons[0].Id }).pipe(
            map(profiles => profiles.find(p => p.RoleId === roleId) || profiles[0] || null)
          );
        }
        return this.api.get<any[]>('/persons', { Name: val }).pipe(
          switchMap(persons2 => {
            if (!persons2[0]) return of(null);
            return this.api.get<any[]>('/profiles', { PersonId: persons2[0].Id }).pipe(
              map(profiles => profiles.find(p => p.RoleId === roleId) || profiles[0] || null)
            );
          })
        );
      }),
      catchError(() => of(null))
    );
  }

  // Para estudiante/conductor la creación requiere 2 tablas: persons + profiles (y license)
  createEstudiante(formData: any, roleId: number): Observable<any> {
    const personId = this.genId('person');
    const profileId = this.genId('profile');
    const person: any = {
      id: personId, Id: personId,
      Name: formData['nombres'] ?? formData['nombre'] ?? 'Sin nombre',
      LastName: formData['apellidos'] ?? '',
      IdentificationType: formData['tipoId'] ?? 'CC',
      IdentificationNumber: formData['identificacion'] ?? String(Date.now()).slice(-10),
      Email: formData['correo'] ?? `${personId}@colegio.edu.co`,
      Phone: String(formData['telefono'] ?? '3000000000').replace(/\D/g, ''),
      ResidenceAddress: formData['direccion'] ?? '—',
      DateBirth: formData['fechaNac'] ?? '2010-01-01',
      Status: 'ACTIVE',
    };
    const campusId = this.getCurrentCampusId();
    if (!campusId) throw new Error('Sesión sin colegio — inicia sesión de nuevo');
    // Mock: password = identificacion (el backend real hashea con PBKDF2, aquí se guarda mock para validar en login mock)
    const rawPass = String(formData['identificacion'] ?? '').trim() || 'Admin123!';
    const profile: any = {
      id: profileId, Id: profileId,
      PersonId: personId,
      CampuseId: campusId,
      RoleId: roleId,
      Status: 'ACTIVE',
      PasswordHash: `mock-${rawPass}`,
    };
    return this.api.post<any>('/persons', person).pipe(
      switchMap(() => this.api.post<any>('/profiles', profile)),
      switchMap((prof) => {
        if (typeNeedsLicense(roleId) && formData['licencia']) {
          const licId = this.genId('lic');
          const lic: any = { id: licId, ID: licId, ProfileId: profileId, LicenseNumber: formData['licencia'], LicenseExpirationDate: formData['vencLicencia'] ?? '2030-01-01', Status: 'ACTIVE' };
          return this.api.post<any>('/driver-licenses', lic).pipe(map(() => prof));
        }
        return of(prof);
      }),
      tap(() => { clearMockCache(); this.triggerRefresh(this.typeForRole(roleId)); }),
      catchError(() => of(null))
    );
  }

  update(type: string, record: any, formData: Record<string, any>): Observable<any> {
    if (!this.isMock) return of(null);
    // Estudiante/conductor/acudiente: actualizar persons (no usan endpointFor)
    if (['estudiante','acudiente','conductor','admins'].includes(type)) {
      const personId = (record as any)?.id ?? (record as any)?.Id ?? (record as any)?.identificacion;
      if (!personId) return of(null);
      const patch: any = {
        Name: formData['nombres'] ?? formData['nombre'],
        LastName: formData['apellidos'] ?? '',
        IdentificationNumber: formData['identificacion'],
        Phone: formData['telefono'] ? String(formData['telefono']).replace(/\D/g,'') : undefined,
        Email: formData['correo'],
        ResidenceAddress: formData['direccion'],
        DateBirth: formData['fechaNac'],
      };
      Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k]);
      // fetch existing, merge y PUT con ambos id/Id
      return this.api.get<any[]>('/persons', { Id: personId }).pipe(
        switchMap(arr => {
          const existing = arr[0];
          if (!existing) return of(null);
          const merged = { ...existing, ...patch, id: existing.id ?? existing.Id, Id: existing.Id ?? existing.id };
          return this.api.put<any>(`/persons/${merged.id}`, merged);
        }),
        tap(() => { clearMockCache(); this.triggerRefresh(type); }),
        catchError(() => of(null))
      );
    }
    const endpoint = this.endpointFor(type);
    const id = (record as any)?.id ?? (record as any)?.Id ?? (record as any)?.identificacion;
    if (!endpoint || !id) return of(null);
    // Familias, buses, rutas, paradas, schools: PUT directo
    return this.api.get<any[]>(endpoint, { Id: id }).pipe(
      switchMap(arr => {
        const existing = arr[0];
        if (!existing) return of(null);
        const merged = { ...existing, ...this.toUpdatePayload(type, formData), id: existing.id ?? existing.Id, Id: existing.Id ?? existing.id };
        return this.api.put<any>(`${endpoint}/${merged.id}`, merged);
      }),
      tap(() => { clearMockCache(); this.triggerRefresh(type); }),
      catchError(() => of(null))
    );
  }

  delete(type: string, record: any): Observable<any> {
    if (!this.isMock) return of(null);
    if (['estudiante','acudiente','conductor','admins'].includes(type)) {
      const pid = (record as any)?.id ?? (record as any)?.Id;
      const profileId = (record as any)?.profileId;
      if (!pid) return of(null);
      const delProfile = profileId ? this.api.delete<any>(`/profiles/${profileId}`) : of(null);
      return delProfile.pipe(
        switchMap(() => this.api.delete<any>(`/persons/${pid}`)),
        tap(() => { clearMockCache(); this.triggerRefresh(type); }),
        catchError((e) => { console.error('[MOCK-API] DELETE estudiante FAIL', e); return of(null); })
      );
    }
    const endpoint = this.endpointFor(type);
    const id = (record as any)?.id ?? (record as any)?.Id;
    if (!endpoint || !id) return of(null);
    return this.api.delete<any>(`${endpoint}/${id}`).pipe(
      tap(() => { clearMockCache(); this.triggerRefresh(type); }),
      catchError(() => of(null))
    );
  }

  private endpointFor(type: string): string | null {
    const map: Record<string,string> = {
      familia: '/families', familias: '/families',
      bus: '/buses', buses: '/buses',
      ruta: '/routes', rutas: '/routes',
      parada: '/stops', paradas: '/stops',
      schools: '/schools',
    };
    return map[type] ?? null;
  }

  private toCreatePayload(type: string, f: Record<string,any>): any {
    const id = this.genId(type);
    switch(type){
      case 'familia': case 'familias': return { Id: id, id, Name: f['nombre'] ?? f['Name'] ?? 'Familia', Observations: f['observaciones'] ?? '', Status: 'ACTIVE' };
      case 'bus': case 'buses': return { Id: id, id, CampusId: 'campus-0001-0000-0000-000000000000', Plate: f['matricula'] ?? f['placa'] ?? `XX-${Date.now()%1000}`, Capacity: Number(f['capacidad'] ?? 40), ModelId: 1, GpsDeviceId: 'gps-0001-0000-0000-000000000000', SoatValidity: f['soat'] ?? '2027-01-01', Status: 'ACTIVE' };
      case 'ruta': case 'rutas': return { Id: id, id, CampusId: 'campus-0001-0000-0000-000000000000', Name: f['nombre'] ?? 'Ruta', TargetSector: f['destino'] ?? f['sector'] ?? '—', Status: 'ACTIVE' };
      case 'parada': case 'paradas': return { Id: id, id, CityId: 'city-0001-0000-0000-000000000000', SchoolId: 'school-0001-0000-0000-000000000000', Address: f['nombre'] ?? f['direccion'] ?? '—', Latitude: Number(f['latitud'] ?? 2.9273), Longitude: Number(f['longitud'] ?? -75.2819), Status: 'ACTIVE' };
      case 'schools': return { Id: id, id, CityId: 'city-0001-0000-0000-000000000000', Name: f['nombre'] ?? 'Colegio', Address: f['direccion'] ?? '—', Phone: f['telefono'] ?? '', Email: f['correo'] ?? '', Website: f['web'] ?? '', Theme: 'default', Status: 'ACTIVE' };
      default: return { Id: id, id, ...f };
    }
  }

  private toUpdatePayload(type: string, f: Record<string,any>): any {
    switch(type){
      case 'familia': case 'familias': return { Name: f['nombre'], Observations: f['observaciones'] };
      case 'bus': case 'buses': return { Plate: f['matricula'], Capacity: f['capacidad'] ? Number(f['capacidad']) : undefined, SoatValidity: f['soat'] };
      case 'ruta': case 'rutas': return { Name: f['nombre'], TargetSector: f['destino'] ?? f['sector'] };
      case 'parada': case 'paradas': return { Address: f['nombre'] ?? f['direccion'], Latitude: f['latitud'] ? Number(f['latitud']) : undefined, Longitude: f['longitud'] ? Number(f['longitud']) : undefined };
      case 'schools': return { Name: f['nombre'], Address: f['direccion'], Phone: f['telefono'], Email: f['correo'], Website: f['web'] };
      default: return f;
    }
  }

  private typeForRole(roleId:number):string{
    const m:any={1:'admins',2:'estudiante',3:'acudiente',4:'conductor'};
    return m[roleId]??'estudiante';
  }
}

function typeNeedsLicense(roleId:number):boolean{ return roleId===4; }

