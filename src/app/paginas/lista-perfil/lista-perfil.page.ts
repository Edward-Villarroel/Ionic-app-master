import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseLoginService } from 'src/app/services/firebase-login.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-lista-perfil',
  templateUrl: './lista-perfil.page.html',
  styleUrls: ['./lista-perfil.page.scss'],
})
export class ListaPerfilPage implements OnInit {
  formularioLogin: FormGroup;
  usuariosAlmacenados: Array<{ email: string }> = [];
  mensajesError: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private router: Router,
    private firebase: FirebaseLoginService,

  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async ngOnInit() {
    await this.cargarUsuariosAlmacenados();
  }

  async cargarUsuariosAlmacenados() {
    const usuarios = await this.storage.get('users');
    this.usuariosAlmacenados = usuarios || [];
  }

  rellenarCorreo(correo: string) {
    this.formularioLogin.controls['email'].setValue(correo);
  }

  validarFormulario(): boolean {
    this.mensajesError = {};

    const emailControl = this.formularioLogin.get('email');
    if (emailControl?.hasError('required')) {
      this.mensajesError['email'] = 'El correo es obligatorio';
    } else if (emailControl?.hasError('email')) {
      this.mensajesError['email'] = 'El correo no es válido';
    }

    const passwordControl = this.formularioLogin.get('password');
    if (passwordControl?.hasError('required')) {
      this.mensajesError['password'] = 'La contraseña es obligatoria';
    } else if (passwordControl?.hasError('minlength')) {
      this.mensajesError['password'] =
        'La contraseña debe tener al menos 6 caracteres';
    }

    return Object.keys(this.mensajesError).length === 0;
  }

  async iniciarSesion() {
    if (this.validarFormulario()) {
      const { email, password } = this.formularioLogin.value;
      this.firebase.login(email,password)
      this.router.navigate(['/login']);
    } else {
      console.log('Errores en el formulario:', this.mensajesError);
    }
  }
}

