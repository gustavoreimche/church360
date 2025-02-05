import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { IMember } from '../dto/member.interface';
import { ICreateMinistry } from '../dto/ministry.interface';
import { DATABASE_TABLES } from '../tokens/database-tables.tokens';
import { SupabaseService } from '../supabase/supabase.service';
import { handleSupabaseError } from '../supabase/supabase-error.service';

@Injectable()
export class MinistriesContext {
  supabase = inject(SupabaseService);

  getMembersOfMinistry(ministryId: number): Observable<IMember[]> {
    return from(
      // @ts-expect-error-infite
      this.supabase.from(DATABASE_TABLES.ministries_members).select(`members(*)`).eq('ministryId', ministryId),
    ).pipe(
      handleSupabaseError(this.supabase.errorHandler),
      map(result => {
        return (result ?? []).flatMap((item: { members: IMember[] }) => item.members);
      }),
    );
  }

  createMinistry(payload: ICreateMinistry): Observable<string> {
    return from(this.supabase.upsert(DATABASE_TABLES.ministries, [payload])).pipe(
      handleSupabaseError(this.supabase.errorHandler),
      map(() => 'Ministério criado com sucesso!'),
    );
  }
}
