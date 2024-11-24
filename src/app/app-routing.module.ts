import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { loggedGuard } from './auth/logged.guard';

const routes: Routes = [
  {
    path: 'home',
    
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
    
  },
  
    
  {
    path: 'landing-page',
    loadChildren: () => import('./paginas/landing-page/landing-page.module').then( m => m.LandingPagePageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./paginas/registro/registro.module').then( m => m.RegistroPageModule),
    canActivate:[AuthGuard],
  },
  {
    path: 'registro-auth',
    loadChildren: () => import('./paginas/registro-auth/registro-auth.module').then( m => m.RegistroAuthPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'registro-tienda',
    loadChildren: () => import('./paginas/registro-tienda/registro-tienda.module').then( m => m.RegistroTiendaPageModule),
    canActivate:[AuthGuard],
  },
  {
    path: 'perfil',
    loadChildren: () => import('./paginas/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate:[loggedGuard]
  },
  {
    path: 'formulario',
    loadChildren: () => import('./paginas/formulario/formulario.module').then( m => m.FormularioPageModule)
  },
  {
    path: 'cambiar-contrasena',
    loadChildren: () => import('./paginas/cambiar-contrasena/cambiar-contrasena.module').then( m => m.CambiarContrasenaPageModule)
  },
  {
    path: 'cambiar-usuario',
    loadChildren: () => import('./paginas/cambiar-usuario/cambiar-usuario.module').then( m => m.CambiarUsuarioPageModule)
  },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}