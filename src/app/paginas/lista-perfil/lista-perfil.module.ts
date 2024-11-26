import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ListaPerfilPageRoutingModule } from './lista-perfil-routing.module';

import { ListaPerfilPage } from './lista-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPerfilPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ListaPerfilPage]
})
export class ListaPerfilPageModule {}
