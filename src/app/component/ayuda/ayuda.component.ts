import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrl:'./ayuda.component.scss',
  imports:[IonicModule],
  standalone:true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AyudaComponent {
  constructor(private popoverController: PopoverController) {}

  cerrarAyuda() {
    this.popoverController.dismiss(); 
  }
}
