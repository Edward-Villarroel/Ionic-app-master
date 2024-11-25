import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PhotoService } from 'src/app/services/photo.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
  storedUsers: any[] = []; // Almacena los usuarios guardados localmente

  constructor(
    private toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage,
    private photoService: PhotoService,
    private geolocation: Geolocation,
    private mapService: MapService,
    private firebaseLoginService: FirebaseLoginService,
    private reloadService: ReloadServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.storage.create();

    this.storedUsers = await this.firebaseLoginService.getStoredUsers();

    this.firebaseLoginService.checkAuthState().subscribe((user: any) => {
      this.isLoggedIn = !!user;
    });

    this.mapService.initializeMap('map', 51.505, -0.09);
    this.mapService.loadMarkers();
    this.mapService.getCurrentLocation();
  }

  async ngAfterViewInit(): Promise<void> {}

  async mensajeExito() {
    const toast = await this.toastController.create({
      message: 'Inicio de sesión exitoso',
      duration: 2000,
    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Información',
      message: 'Esto es un mensaje de alerta.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  ingresar() {
    this.router.navigate(['/home']);
  }
  async cerrarSesion() {
    await this.firebaseLoginService.logout();
    this.router.navigate(['/landing-page']);
    this.reloadService.reloadRoute();
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
    this.router.navigate(['/perfil']);
  }

  irFormulario() {
    this.router.navigate(['/formulario']);
  }

  async actualizarUsuariosAlmacenados() {
    this.storedUsers = await this.firebaseLoginService.getStoredUsers();
    console.log('Usuarios almacenados localmente:', this.storedUsers);
  }

  async actualizarMensaje() {
    const ingresado = this.storedUsers.length > 0;
    this.cerrar = ingresado ? 'Cerrar sesión' : '';
  }
}
