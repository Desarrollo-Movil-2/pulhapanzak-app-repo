import { Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth-guard';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./auth/ui/pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/ui/pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: '',
    loadChildren: () => import('./shared/ui/pages/tabs/tabs.routes').then(m => m.routes),
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/ui/pages/profile/profile.page').then( m => m.ProfilePage)
  },


];
