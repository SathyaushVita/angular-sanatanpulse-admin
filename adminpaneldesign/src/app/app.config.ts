// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';



// import { routes } from './app.routes';
// import { importProvidersFrom } from '@angular/core';

// export const appConfig: ApplicationConfig = {
//   providers: [
//               provideZoneChangeDetection({ eventCoalescing: true }),
//               provideRouter(routes),
//               importProvidersFrom(HttpClientModule),
//   ]
// };


import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NzModalService } from 'ng-zorro-antd/modal';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
  
    NzModalService, provideAnimationsAsync()
  ]
};



