import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { setProblemTranslator } from '@core/http/problem-detail';

describe('App', () => {
  afterEach(() => {
    setProblemTranslator((key) => key);
    document.body.className = '';
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the application route outlet rather than the retired starter page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(fixture.debugElement.query(By.directive(RouterOutlet))).not.toBeNull();
    expect(compiled.querySelector('h1')).toBeNull();
    expect(compiled.textContent).not.toContain('Hello, dvlp-web');
  });
});
