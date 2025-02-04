import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { NgSupabase } from './ng-supabase.service';
import { SuprabaseClientConfig } from './ng-supabase.types';

@NgModule()
export class NgSupabaseModule {
  static initClient(config: SuprabaseClientConfig): ModuleWithProviders<NgSupabaseModule> {
    return {
      ngModule: NgSupabaseModule,
      providers: [
        NgSupabase,
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [NgSupabase],
          useFactory: (supabase: NgSupabase) => () => {
            const url = config.url;
            const key = config.key;
            supabase.client = createClient(url, key);
          },
        },
      ],
    };
  }
}
