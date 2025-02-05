import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { SuprabaseClientConfig } from './supabase.types';

@NgModule()
export class SupabaseModule {
  static initClient(config: SuprabaseClientConfig): ModuleWithProviders<SupabaseModule> {
    return {
      ngModule: SupabaseModule,
      providers: [
        SupabaseService,
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [SupabaseService],
          useFactory: (supabase: SupabaseService) => () => {
            const url = config.url;
            const key = config.key;
            supabase.client = createClient(url, key);
          },
        },
      ],
    };
  }
}
