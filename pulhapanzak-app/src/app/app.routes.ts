import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./auth/ui/pages/register/register.page').then( m => m.RegisterPage)
  },
  {
<<<<<<< Updated upstream
    path: 'tabs',
    loadComponent: () => import('./shared/ui/pages/tabs/tabs.page').then( m => m.TabsPage)
  },
  {
    path:'',
    redirectTo:'login',
    
  }

=======
    path: 'login',
    loadComponent: () => import('./auth/ui/pages/login/login.page').then( m => m.LoginPage)
  },
>>>>>>> Stashed changes

];
