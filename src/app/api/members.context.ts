import { inject, Injectable } from '@angular/core';
import { NgSupabase } from '@church360/ng-supabase';
import { from, map, Observable } from 'rxjs';
import { IMember } from '../dto/member.interface';

@Injectable()
export class MembersContext {
  supabase = inject(NgSupabase);

  getMembers(): Observable<IMember[]> {
    return from(this.supabase.select('members')).pipe(
      map(data => {
        if (data.error) throw data.error;
        return data.data as unknown as IMember[];
      }),
    );
  }
}
