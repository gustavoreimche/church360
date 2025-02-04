import { Routes } from '@angular/router';

export const routes: Routes = [{ path: 'login', loadComponent: () => import('./pages/login/login-page').then(c => c.LoginPage) }];
