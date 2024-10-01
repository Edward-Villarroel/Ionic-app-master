import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Router} from '@angular/router';
import { ToastController ,AlertController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';



@Component({
  
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
   imageURL:string="";
   nombre:string="";
   usuario:string="";
   contrasena:string="";
   cerrar:string="";
  constructor( public mensaje:ToastController, private route:Router, public alerta:AlertController, private storage: Storage) {
    this.updateImage();
    this.msg();
    
   }
   
    async updateImage(){
      const storage= await this.storage.create();
      const ingresado=await this.storage.get('ingresado');
      const usuario= await this.storage.get('usuario');
      if (ingresado==true && usuario.role=='empresa'){
        this.imageURL='assets/icon/logo_duoc.png'
      }else if (ingresado==true && usuario.role=='persona'){
        this.imageURL='assets/icon/mclovin.jpg'
      }else{
        this.imageURL='assets/icon/usuario.png'
      }
    }
    async mensajeExito(){
        const toast= await this.mensaje.create({
          message:'inicio de sesion exitoso',
          duration:2000
        });
        toast.present();
        

    }
    async presentAlert() {
      const alert = await this.alerta.create({
        header: 'Alert',
        subHeader: 'Subtitle',
        message: 'This is an alert message.',
        buttons: ['OK']
      });
    
      await alert.present();
    }
    ingresar(){
    
        this.route.navigate(['/home']);
      }
    
    async msg(){
      const storage= await this.storage.create();
      const ingresado=await this.storage.get('ingresado');
      if (ingresado==true){
        this.cerrar='cerrar sesion';
      }else {
        this.cerrar='';
      }
    }
    
    async cerrarSesion(){

        this.storage.set('ingresado',false);
        this.route.navigate(['/landing-page']);
    }
  async ngOnInit() {
    const storage= await this.storage.create();
    const usuario=await this.storage.get('usuario');
    const ingresado=await this.storage.get('ingresado');
  }
  
}
