import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FirebaseLoginService } from '../../services/firebase-login.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private route: Router,
    private storage: Storage,
    private firebaseLoginService: FirebaseLoginService
  ) {
    this.formularioRegistro = this.fb.group({
      correo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+\.com$/), 
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      rut: new FormControl('', Validators.required),
    });
  }

  get correo() {
    return this.formularioRegistro.get('correo');
  }

  async registrarse() {
    const formValue = this.formularioRegistro.value;

    if (this.formularioRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Información errónea o incompleta',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const nuevoUsuario = {
      correo: formValue.correo,
      password: formValue.password,
      rut: formValue.rut,
      role: 'persona',
    };

    try {
      await this.firebaseLoginService.createUser(
        formValue.correo,
        formValue.password,
        nuevoUsuario.role,
        nuevoUsuario.rut
      );

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Usuario registrado exitosamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.route.navigate(['./login']);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al registrar el usuario. Inténtalo nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async ngOnInit() {
    await this.storage.create();
  }
}
