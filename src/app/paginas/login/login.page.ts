import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PhotoService } from 'src/app/services/photo.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CommonModule } from '@angular/common';
import { MapService } from 'src/app/services/map.service';
import { FirebaseLoginService } from 'src/app/services/firebase-login.service';
import { ReloadServiceService } from 'src/app/services/reload-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  public isLoggedIn = false;
  imageURL: string = '';
  nombre: string = '';
  usuario: string = '';
  contrasena: string = '';
  cerrar: string = '';
  
  constructor(
    public mensaje: ToastController,
    private route: Router,
    public alerta: AlertController,
    private storage: Storage,
    public photoService: PhotoService,
    private geolocation: Geolocation,
    private mapService:MapService,
    private firebaseLoginService:FirebaseLoginService,
    private reload:ReloadServiceService,

  ) {
    this.msg();
  }

  async mensajeExito() {
    const toast = await this.mensaje.create({
      message: 'inicio de sesión exitoso',
      duration: 2000,
    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alerta.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  ingresar() {
    this.route.navigate(['/home']);
  }

  async msg() {
    const storage = await this.storage.create();
    const ingresado = await this.storage.get('ingresado');
    this.cerrar = ingresado ? 'cerrar sesión' : '';
  }

  async cerrarSesion() {
    this.firebaseLoginService.logout();
    this.route.navigate(['/landing-page']);
    this.reload.reloadRoute();
  }

  ngOnInit(): void {
    this.mapService.initializeMap('map', 51.505, -0.09);
    this.mapService.loadMarkers();
    this.mapService.getCurrentLocation();
    this.firebaseLoginService.getAuthState().subscribe((user:any) => {
      this.isLoggedIn = !!user; 
    });
  }

  centrarMapa(): void {
    this.mapService.getCurrentLocation();
  }

  agregarMarcador(): void {
    const lat = 51.505;
    const lng = -0.09;
    const titulo = prompt('Ingrese el título del marcador:') ?? 'Sin título';
    const horario = prompt('Ingrese una descripción del marcador:') ?? 'Sin descripción';
    this.mapService.addMarker(lat, lng, titulo, horario);
  }

  irPerfil() {
    this.route.navigate(['/perfil']);
  }

  irFormulario() {
    this.route.navigate(['/formulario']);
  }
  async ngAfterViewInit(): Promise<void> {}
}

