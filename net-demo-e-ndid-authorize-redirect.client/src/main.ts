import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

export function getBaseUrl() {
  if (!environment.production)
    return environment.baseUrl;
  return `${document.getElementsByTagName('base')[0].href}`;
}

export function getBaseApi() {
  if (!environment.production)
    return environment.baseApi;
  return `${document.getElementsByTagName('base')[0].href}api/`;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  { provide: 'BASE_API', useFactory: getBaseApi, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
