import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { FirebaseLoginService } from '../services/firebase-login.service';
import { ReloadServiceService } from '../services/reload-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  correo: string = '';
  contrasena: string = '';
  rut: string = '';
  formularioLogin: FormGroup;
  isLoggedIn: boolean | undefined;

  constructor(
    public mensaje: ToastController,
    private route: Router,
    public alerta: AlertController,
    public fb: FormBuilder,
    private loginFirebase: FirebaseLoginService,
    private reload: ReloadServiceService
  ) {
    this.formularioLogin = this.fb.group({
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  async ingresar() {
    const { correo, password } = this.formularioLogin.value;

    if (!correo.trim() || !password.trim()) {
      alert('Los campos no pueden estar vacíos');
      return;
    }

    try {
      await this.loginFirebase.login(correo, password);
      this.formularioLogin.reset();
      this.route.navigate(['/login']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const alert = await this.alerta.create({
        header: 'Error',
        message: 'Correo o contraseña incorrectos.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async ngOnInit() {
    this.loginFirebase.authState$.subscribe((state) => {
      this.isLoggedIn = state;
    });
  }
}
