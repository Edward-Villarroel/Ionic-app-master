import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CambiarUsuarioPageRoutingModule } from './cambiar-usuario-routing.module';
import { CambiarUsuarioPage } from './cambiar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CambiarUsuarioPageRoutingModule
  ],
  declarations: [CambiarUsuarioPage],
})
export class CambiarUsuarioPageModule {}
