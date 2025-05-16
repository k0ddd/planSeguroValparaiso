import { Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage),
      },
      {
        path: 'comentario',
        loadComponent: () => import('./comentario/comentario.component').then(m => m.ComentarioComponent),
      },
      {
        path: 'camara',
        loadComponent: () => import('./camara/camara.component').then(m => m.CamaraComponent),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent),
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage),
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./recuperar-contrasena/recuperar-contrasena.page').then(m => m.RecuperarContrasenaPage),
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  }
];
