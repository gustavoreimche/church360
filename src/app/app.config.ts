import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { icons } from './icons-provider';
import { environment } from '../../environments/environment';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { SupabaseModule } from './supabase/supabase.module';

registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(pt_BR),
    importProvidersFrom(FormsModule),
    importProvidersFrom(NzIconModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzIcons(icons),
    importProvidersFrom(SupabaseModule.initClient({ url: environment.supabaseUrl, key: environment.supabaseKey })),
  ],
};
