import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }


  passwordsMatch(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notMatching: true };
  }


  
  onSubmit() {
    if (this.passwordForm.valid) {
 

  onSubmit() {
    if (this.passwordForm.valid) {
      
      console.log('Contraseña cambiada con éxito');
    }
  }


  clearForm() {
    this.passwordForm.reset();
  }
}
