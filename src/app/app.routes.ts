import { Routes } from '@angular/router';
import { MainLayout } from './layout/main.layout';
import { AuthGuard } from './guards/auth.guard';
import { IMenuItem } from './layout/components/menu-items-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home.page').then(c => c.HomePage),
      },
      { path: 'membros', loadComponent: () => import('./pages/members/members.page').then(c => c.MembersPage) },
    ],
  },
  { path: 'login', loadComponent: () => import('./pages/login-page').then(c => c.LoginPage) },
];

export const appMenus: IMenuItem[] = [
  { label: 'Home', icon: 'home', routerLink: '/home' },
  { label: 'Membros', icon: 'user', routerLink: '/membros' },
];
