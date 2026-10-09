import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Themes } from './themes';
import { TranslateModule } from '@ngx-translate/core';

describe('Themes', () => {
  let component: Themes;
  let fixture: ComponentFixture<Themes>;
  let originalClasses: string;
  let originalTheme: string | null;

  beforeEach(async () => {
    originalClasses = document.body.className;
    originalTheme = localStorage.getItem('theme');
    await TestBed.configureTestingModule({
      imports: [Themes, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Themes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    document.body.className = originalClasses;
    if (originalTheme === null) localStorage.removeItem('theme');
    else localStorage.setItem('theme', originalTheme);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('preserves layout markers when changing the theme without navigation', () => {
    document.body.className = 'internal-page light-theme-blue another-marker';
    component.setTheme('dark-theme-green');
    expect(document.body.classList.contains('internal-page')).toBe(true);
    expect(document.body.classList.contains('another-marker')).toBe(true);
    expect(document.body.classList.contains('light-theme-blue')).toBe(false);
    expect(document.body.classList.contains('dark-theme-green')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark-theme-green');
  });
});
