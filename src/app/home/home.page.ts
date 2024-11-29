import { Component, OnInit, Injectable } from '@angular/core';
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
  nombre: string = '';
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
    private reload:ReloadServiceService,

  ) {
    this.formularioLogin = this.fb.group({
      nombre: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  async ingresar() {
    const { nombre, password } = this.formularioLogin.value;

    if (!nombre.trim() || !password.trim()) {
      alert('Los campos no pueden estar vacíos');
      return;
    }
    await this.loginFirebase.login(nombre, password);
    this.formularioLogin.reset;
    this.route.navigate(['/login']);
  
  }

  async ngOnInit() {
    this.loginFirebase.authState$.subscribe((state) => {
      this.isLoggedIn = state;
    });
  }  }

