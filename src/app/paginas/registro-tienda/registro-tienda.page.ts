import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FirebaseLoginService } from '../../services/firebase-login.service';

@Component({
  selector: 'app-registro-tienda',
  templateUrl: './registro-tienda.page.html',
  styleUrls: ['./registro-tienda.page.scss'],
})
export class RegistroTiendaPage implements OnInit {
  formularioRegistro: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public route: Router,
    private storage: Storage,
    private firebaseLoginService: FirebaseLoginService
  ) {
    this.formularioRegistro = this.fb.group({
      correo: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', Validators.required),
      rut_empresa: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        this.rutMinValueValidator(50000000),
      ]),
    });
  }

  private rutMinValueValidator(minValue: number) {
    return (control: AbstractControl) => {
      const value = Number(control.value);
      if (isNaN(value) || value < minValue) {
        return { minValue: true };
      }
      return null; 
    };
  }

  async registrarse() {
    const f = this.formularioRegistro.value;

    if (this.formularioRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Información errónea o incompleta',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (f.password !== f.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'Las contraseñas no coinciden',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const usuario = {
      correo: f.correo,
      password: f.password,
      rut: f.rut_empresa,
      role: 'tienda',
    };

    try {
      await this.firebaseLoginService.createUser(
        usuario.correo,
        usuario.password,
        usuario.role,
        usuario.rut
      );

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tienda registrada correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
      this.route.navigate(['./login']);
    } catch (error) {
      console.error('Error al registrar tienda:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al registrar la tienda. Inténtalo nuevamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async ngOnInit() {
    await this.storage.create();
  }
}
