import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AssignRecord } from './assign-record';

describe('AssignRecord student route assignment', () => {
  const profileId = '11111111-1111-1111-1111-111111111111';
  const personId = '22222222-2222-2222-2222-222222222222';
  const routeId = '33333333-3333-3333-3333-333333333333';
  const stopId = '44444444-4444-4444-4444-444444444444';
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AssignRecord] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the profile assignment and posts the profile GUID, not the person ID', () => {
    const fixture = TestBed.createComponent(AssignRecord);
    const component = fixture.componentInstance;
    component.type = 'student';
    component.record = { id: personId, profileId };
    const assigned = vi.fn();
    const closed = vi.fn();
    component.assigned.subscribe(assigned);
    component.closed.subscribe(closed);
    fixture.detectChanges();

    http.expectOne(req => req.url.endsWith('/routes')).flush([{ id: routeId, name: 'Route' }]);
    http.expectOne(req => req.url.endsWith(`/routes/student/${profileId}`))
      .flush(null, { status: 404, statusText: 'Not Found' });
    component.selectedRouteId = routeId;
    component.onRouteChange(routeId);
    http.expectOne(req => req.url.endsWith(`/routes/${routeId}`))
      .flush({ id: routeId, stops: [{ id: stopId, name: 'Stop' }] });
    component.selectedStopId = stopId;
    expect(component.canSubmit).toBe(true);
    component.submit();

    const request = http.expectOne(req => req.url.endsWith(`/routes/${routeId}/students`));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ studentId: profileId, stopId });
    expect(request.request.body.studentId).not.toBe(personId);
    request.flush({ studentId: profileId, stopId });
    expect(assigned).toHaveBeenCalledOnce();
    expect(closed).toHaveBeenCalledOnce();
  });

  for (const invalidProfile of [undefined, null, '', 'not-a-guid', '00000000-0000-0000-0000-000000000000']) {
    it(`blocks assignment and shows an explicit error for profile ${invalidProfile}`, () => {
      const fixture = TestBed.createComponent(AssignRecord);
      const component = fixture.componentInstance;
      component.type = 'student';
      component.record = { id: personId, profileId: invalidProfile };
      fixture.detectChanges();
      component.selectedRouteId = routeId;
      component.selectedStopId = stopId;
      expect(component.canSubmit).toBe(false);
      component.submit();
      expect(component.submitting).toBe(false);
      expect(component.message).toBe('assign_record.student.missingProfile');
      http.expectNone(() => true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.assign-record__message').textContent)
        .toContain('assign_record.student.missingProfile');
      expect(fixture.nativeElement.querySelector('.modal__btn--submit').disabled).toBe(true);
    });
  }
});
