import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-popupformulario',
  templateUrl: './popupformulario.component.html', 
  styleUrls: ['./popupformulario.component.scss'],
  imports:[IonicModule],
  standalone:true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PopupFormulario implements OnInit {
  @Input() tiempoRestante: number = 10; 
  tiempo: number = this.tiempoRestante; 
  intervalo: any; 

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.iniciarCuentaRegresiva(); 
  }

  iniciarCuentaRegresiva() {
    this.intervalo = setInterval(() => {
      this.tiempo--;
      if (this.tiempo <= 0) {
        this.cerrar(); 
      }
    }, 1000);
  }

  cerrar() {
    clearInterval(this.intervalo); 
    this.modalController.dismiss(); 
  }
}