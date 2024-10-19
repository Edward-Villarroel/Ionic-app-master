import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { AyudaComponent } from '../../component/ayuda/ayuda.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
  animations: [
    trigger('circuloAnimacion', [
      state('inactivo', style({
        transform: 'scale(1)',
      })),
      state('activo', style({
        transform: 'scale(0)',
      })),
      transition('inactivo => activo', [
        animate('0.3s ease-out'),
      ]),
      transition('activo => inactivo', [
        animate('0.3s ease-in'),
      ]),
    ]),
  ],
})
export class FormularioPage implements OnInit {
  formulario: FormGroup;
  enviado = false; // Agrega esta línea para declarar la propiedad 'enviado'.

  constructor(private formBuilder: FormBuilder, private popoverController: PopoverController) {
    this.formulario = this.formBuilder.group({
      nombreDuenio: ['', [Validators.required, Validators.minLength(3)]],
      apellidoDuenio: ['', [Validators.required, Validators.minLength(4)]],
      nombreEstablecimiento: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]],
    });
  }

  ngOnInit() {}

  subirImagen() {
    console.log('Subiendo imagen...');
  }

  subirPDF(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      const file = fileInput.files[0];
      console.log('Subiendo PDF:', file);
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log('Formulario válido:', this.formulario.value);
      
      // Muestra el mensaje de éxito
      this.enviado = true;

      // Reinicia el formulario si lo deseas
      this.formulario.reset();
      
      // Oculta el mensaje después de un tiempo
      setTimeout(() => {
        this.enviado = false;
      }, 3000); // 3 segundos
    } else {
      console.log('Formulario no válido');
    }
  }

  async abrirAyuda() {
    const popover = await this.popoverController.create({
      component: AyudaComponent, 
      translucent: true
    });
    await popover.present();
  }
}
