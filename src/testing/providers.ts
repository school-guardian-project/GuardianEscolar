import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

export default [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  provideTranslateService({ fallbackLang: 'es', lang: 'es' }),
];
