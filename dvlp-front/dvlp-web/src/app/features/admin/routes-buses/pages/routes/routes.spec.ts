import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesPage } from './routes';

describe('RoutesPage', () => {
  let component: RoutesPage;
  let fixture: ComponentFixture<RoutesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
