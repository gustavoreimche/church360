import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { from, map, Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthContext {
  supabase = inject(SupabaseService);
  userService = inject(UserService);

  signIn(email: string, password: string): Observable<User> {
    return from(this.supabase.auth.signInWithPassword({ email, password }))
      .pipe(
        map(({ data, error }) => {
          if (error) throw error;
          return data.user;
        }),
      )
      .pipe(tap(user => this.userService.setUser(user)));
  }

  authenticatedUser(): Observable<User | null> {
    return from(this.supabase.auth.getUser()).pipe(map(({ data }) => data.user));
  }

  logout(): void {
    this.supabase.auth.signOut();
    localStorage.clear();
  }

  async isAuthenticated(): Promise<boolean> {
    const result = await this.supabase.auth.getSession();
    return !!result.data.session;
  }
}
