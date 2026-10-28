import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Main } from './main';
import { HttpTestingController } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';

describe('Main', () => {
  let component: Main;
  let fixture: ComponentFixture<Main>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Main],
    }).compileComponents();

    fixture = TestBed.createComponent(Main);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows separate static dashboard and map previews without fake controls or backend calls', () => {
    const root: HTMLElement = fixture.nativeElement;
    const preview = root.querySelector('.right-index')!;
    expect(preview.querySelector('.product-preview__desktop')).toBeTruthy();
    expect(preview.querySelector('.product-preview__phone')).toBeTruthy();
    expect(preview.querySelector('svg.product-preview__cartography')).toBeTruthy();
    expect(preview.querySelector('.product-preview__vehicle')).toBeTruthy();
    expect(preview.querySelectorAll('.product-preview__metrics > div')).toHaveLength(3);
    expect(preview.querySelectorAll('button, a, input, select, iframe')).toHaveLength(0);
    expect(preview.querySelector('.phone-alert, .activity-panel, .dashboard-shell')).toBeNull();
    expect(preview.querySelector('figcaption')).toBeTruthy();
    TestBed.inject(HttpTestingController).expectNone(request => !request.url.includes('assets/i18n'));
  });

  it('retains the six hero lines and the existing download and navigation links', () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.left-index')?.children).toHaveLength(7);
    expect(root.querySelector('#funcionalidades')).toBeTruthy();
    expect(root.querySelector('#como-funciona')).toBeTruthy();
    expect(root.querySelector('button[routerLink="/contact"]')).toBeTruthy();
  });

  it('localizes the preview description and illustration notice', async () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', {
      right_index: { preview: { description: 'Panel y mapa ilustrativos', caption: 'Sin datos en tiempo real' } },
    }, true);
    translate.use('es');
    fixture.detectChanges();
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.product-preview')?.getAttribute('aria-label')).toBe('Panel y mapa ilustrativos');
    expect(root.querySelector('figcaption')?.textContent).toContain('Sin datos en tiempo real');
  });
});
