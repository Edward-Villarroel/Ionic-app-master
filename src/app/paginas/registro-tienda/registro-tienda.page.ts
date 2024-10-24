import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validator,FormControl, Validators,ReactiveFormsModule} from '@angular/forms';
import { AlertController, ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PhotoService } from 'src/app/services/photo.service';


@Component({
  selector: 'app-registro-tienda',
  templateUrl: './registro-tienda.page.html',
  styleUrls: ['./registro-tienda.page.scss'],
})
export class RegistroTiendaPage implements OnInit {
  formularioRegistro:FormGroup;
  photo: PhotoService['photos'] = [];


  constructor(public fb:FormBuilder, public alertController: AlertController, public route:Router, private storage:Storage,public photoService: PhotoService) {
    this.formularioRegistro=this.fb.group({
      'nombre': new FormControl('',Validators.required),
      'password': new FormControl('',Validators.required),
      'confirmPassword': new FormControl('',Validators.required),
      'rut_empresa': new FormControl('',Validators.required),
    })
   }
  addPhotoToGallery() {
    this.photoService.addNewToGallery();

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
        rut: f.rut_empresa,
        role:'empresa',
        foto:this.photo
      }
      this.route.navigate(['./login']);
    }

   await this.storage.set('usuario',usuario);
  }
async ngOnInit() {
  const storage=await this.storage.create()
  const usuario=await this.storage.get('usuario');
  const ingresado=await this.storage.get('ingresado');
  await this.photoService.loadSaved();
}


}
