import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withInterceptors,
  HttpClient
} from '@angular/common/http';
import { CustomInterceptor } from '../services/custom-interceptor';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomLoader } from './translator/translator';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([CustomInterceptor])),

    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: CustomLoader,
          deps: [HttpClient]
        }
      })
    )
  ]
};
