import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./shared/ui/pages/tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path:'',
    redirectTo:'login',
    
  }


];
