import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Map, tileLayer, marker } from 'leaflet';
import { PhotoService } from 'src/app/services/photo.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  imageURL: string = '';
  nombre: string = '';
  usuario: string = '';
  contrasena: string = '';
  cerrar: string = '';
  photo: PhotoService = new PhotoService();
  map: Map | undefined;

  constructor(
    public mensaje: ToastController,
    private route: Router,
    public alerta: AlertController,
    private storage: Storage,
    public photoService: PhotoService,

    // SERVICIO DE GEOLOCALIZACION
    private geolocation: Geolocation
  ) {
    this.updateImage();
    this.msg();
  }

  async updateImage() {
    const storage = await this.storage.create();
    const ingresado = await this.storage.get('ingresado');
    if (ingresado == true) {
      this.imageURL = 'assets/icon/mclovin.jpg';
    } else {
      this.imageURL = 'assets/icon/usuario.png';
    }
  }

  async mensajeExito() {
    const toast = await this.mensaje.create({
      message: 'inicio de sesion exitoso',
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
    if (ingresado == true) {
      this.cerrar = 'cerrar sesion';
    } else {
      this.cerrar = '';
    }
  }

  async cerrarSesion() {
    this.storage.set('ingresado', false);
    this.route.navigate(['/landing-page']);
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    this.map = new Map('map').setView([51.505, -0.09], 13);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        const lat = resp.coords.latitude;
        const lng = resp.coords.longitude;

        if (this.map) {
          this.map.setView([lat, lng], 13);

          marker([lat, lng])
            .addTo(this.map)
            .bindPopup('Tu ubicación')
            .openPopup();
        }
      })
      .catch((error) => {
        console.log('Error obteniendo la ubicación', error);
      });
  }

  async ngOnInit() {
    const storage = await this.storage.create();
    const usuario = await this.storage.get('usuario');
    const ingresado = await this.storage.get('ingresado');
    const fotografias = await this.photoService.loadSaved();
  }
}
