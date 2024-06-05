import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard';
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
    path: 'tabs',
    loadComponent: () => import('./shared/ui/pages/tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },  {
    path: 'profile',
    loadComponent: () => import('./profile/ui/pages/profile/profile.page').then( m => m.ProfilePage)
  },


];
