import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
   component:TabsPage,
   children:[
    {
        path:'home',
        loadComponent:()=>import('../../../../home/home.page').then((m)=>m.HomePage)
    },
    {
        path:'gallery',
        loadComponent:()=>import('../../../../gallery/ui/pages/gallery/gallery.page').then((m)=>m.GalleryPage)
    }
   ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  
];
