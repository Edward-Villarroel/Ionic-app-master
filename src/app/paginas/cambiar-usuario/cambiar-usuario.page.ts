import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-cambiar-nombre-usuario',
  templateUrl: './cambiar-usuario.page.html',
  styleUrls: ['./cambiar-usuario.page.scss'],
})
export class CambiarUsuarioPage {
  usernameForm: FormGroup;

  constructor(private fb: FormBuilder, private toastController: ToastController) {
    this.usernameForm = this.fb.group({
      newUsername: ['', Validators.required],
      currentPassword: ['', Validators.required],
    });
  }

  async updateUsername() {
    const { newUsername, currentPassword } = this.usernameForm.value;

    if (this.usernameForm.invalid) {
      return;
    }

    try {
      const user = firebase.auth().currentUser;

      if (user) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email as string,
          currentPassword
        );

        await user.reauthenticateWithCredential(credential);
        
        await user.updateProfile({
          displayName: newUsername,
        });

        this.showToast('Nombre de usuario actualizado correctamente');
      }
    } catch (error: any) {
      this.showToast(`Error al actualizar el nombre de usuario: ${error.message}`);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, 
      position: 'bottom', 
    });
    await toast.present();
  }

  onSubmit() {
    if (this.usernameForm.valid) {
      this.updateUsername();
    }
  }

  Limpiar() {
    this.usernameForm.reset();
  }
}
