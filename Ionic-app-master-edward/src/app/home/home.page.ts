import { Component, OnInit,Injectable } from '@angular/core';
import {Router} from '@angular/router';
import { ToastController ,AlertController,} from '@ionic/angular';
import { FormBuilder,FormGroup,FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { FirebaseLoginService } from '../services/firebase-login.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
   nombre:string=""
   contrasena:string=""
   rut:string=""
   formularioLogin:FormGroup;
  constructor(public mensaje:ToastController, 
              private route:Router, 
              public alerta:AlertController,
              public fb:FormBuilder,
              private storage: Storage,
              private loginFirebase:FirebaseLoginService
              ) {
    this.formularioLogin=this.fb.group({
      'nombre': new FormControl('',Validators.required),
      'password': new FormControl('',Validators.required),
    })
  }
  
  async ingresar() {
    var f = this.formularioLogin.value;


    if(f.nombre==' ' &&  f.password==' '){
      const alert = await this.alerta.create({
        header: 'Alerta',
        message: 'los campos no pueden estar vacios',
        buttons: ['OK'],
      });
  
      await alert.present();
      return;
      
    }else{
      this.loginFirebase.login(f.nombre,f.password)
      
    }
  }
  async iniciar(){
     

}
 
  async ngOnInit() {
    const storage= await this.storage.create();
  }
}
