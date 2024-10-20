import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-popupformulario',
  templateUrl: './popupformulario.component.html', // Asegúrate de que este archivo exista
  styleUrls: ['./popupformulario.component.scss']
})
export class PopupFormulario implements OnInit {
  @Input() tiempoRestante: number = 10; // Inicializa con un valor por defecto
  tiempo: number = this.tiempoRestante; // Variable para almacenar el tiempo actual
  intervalo: any; // Para manejar el intervalo de cuenta regresiva

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.iniciarCuentaRegresiva(); // Inicia la cuenta regresiva
  }

  iniciarCuentaRegresiva() {
    this.intervalo = setInterval(() => {
      this.tiempo--;
      if (this.tiempo <= 0) {
        this.cerrar(); // Cierra el popup cuando el tiempo se agote
      }
    }, 1000);
  }

  cerrar() {
    clearInterval(this.intervalo); // Detiene el intervalo
    this.modalController.dismiss(); // Cierra el popup
  }
}
