import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validator,FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { AlertController, ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioRegistro:FormGroup;
  constructor(public fb:FormBuilder, public alertController: AlertController, public route:Router, private storage:Storage) { 
    this.formularioRegistro=this.fb.group({
      'nombre': new FormControl('',Validators.required),
      'password': new FormControl('',Validators.required),
      'confirmPassword': new FormControl('',Validators.required),
      'rut': new FormControl('',Validators.required),
    })

  }
    async registrarse(){
      var f = this.formularioRegistro.value;

      if(this.formularioRegistro.invalid){
        const alert = await this.alertController.create({
          header: 'Alerta',
          message: 'Informacion erronea o incompleta',
          buttons: ['OK'],
        });
    
        await alert.present();
        return;
      }else{
        var usuario={
          nombre: f.nombre,
          password: f.password,
          rut: f.rut,
          role:'persona',
        }
        this.route.navigate(['./login']);
      }

     await this.storage.set('usuario',usuario);
    }
  async ngOnInit() {
    const storage=await this.storage.create()
    const usuario=await this.storage.get('usuario');
    const ingresado=await this.storage.get('ingresado');
  }

}
