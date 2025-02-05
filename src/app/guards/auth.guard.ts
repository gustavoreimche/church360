import { CanActivate, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthContext } from '../api/auth.context';
import { inject, Injectable } from '@angular/core';
import { from, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  auth = inject(AuthContext);
  router = inject(Router);

  canActivate(): MaybeAsync<GuardResult> {
    return from(this.auth.isAuthenticated()).pipe(
      tap(isAuth => {
        if (!isAuth) this.router.navigate(['login']);
      }),
    );
  }
}
