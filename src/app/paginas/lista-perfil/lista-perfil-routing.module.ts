import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPerfilPage } from './lista-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPerfilPageRoutingModule {}
