import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { IMember } from '../dto/member.interface';
import { SupabaseService } from '../supabase/supabase.service';
import { handleSupabaseError } from '../supabase/supabase-error.service';
import { DATABASE_TABLES } from '../tokens/database-tables.tokens';

@Injectable()
export class MembersContext {
  supabase = inject(SupabaseService);

  getMembers(): Observable<IMember[]> {
    return from(this.supabase.select(DATABASE_TABLES.members)).pipe(
      handleSupabaseError(this.supabase.errorHandler),
      map(data => {
        return data as unknown as IMember[];
      }),
    );
  }

  getVoluntaries(): Observable<IMember[]> {
    // @ts-expect-error-infite
    return from(this.supabase.select(DATABASE_TABLES.members).eq('voluntario', true)).pipe(
      handleSupabaseError(this.supabase.errorHandler),
      map(data => {
        return data as unknown as IMember[];
      }),
    );
  }
}
