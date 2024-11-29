import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PhotoService } from 'src/app/services/photo.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapService } from 'src/app/services/map.service';
import { FirebaseLoginService } from 'src/app/services/firebase-login.service';
import { ReloadServiceService } from 'src/app/services/reload-service.service';
import { PopuptiendaComponent } from 'src/app/component/popuptienda/popuptienda.component';
import { PopuppersonaComponent } from 'src/app/component/popuppersona/popuppersona.component';
import { PopoverController } from '@ionic/angular';
import { CajasService } from 'src/app/services/cajas.service';

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
  storedUsers: any[] = [];
  role: string | null = null;;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage,
    private photoService: PhotoService,
    private geolocation: Geolocation,
    private mapService: MapService,
    private firebaseLoginService: FirebaseLoginService,
    private reloadService: ReloadServiceService,
    private popoverController: PopoverController,
    private cajasService: CajasService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.storage.create();
    this.firebaseLoginService.getUserRole().subscribe((role) => {
      this.role = role;
    });
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
  async showFavorites() {
    if (this.role === 'persona') {
      console.log('Mostrar favoritos para persona');
      const popover = await this.popoverController.create({
        component: PopuppersonaComponent, 
        translucent: true
      });
      await popover.present();
    } else if (this.role === 'tienda') {
      console.log('Mostrar favoritos para tienda');
      const popover = await this.popoverController.create({
        component: PopuptiendaComponent, 
        translucent: true
      });
      await popover.present();
    }
    else {
      console.log('Rol no reconocido o no asignado:', this.role);
    }
  }
  async showMarkersPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopuptiendaComponent,
      event: event,
      translucent: true
    });
    await popover.present();
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

  async irPerfil() {
    const isLoggedIn = await this.firebaseLoginService.isLoggedIn();
    const storedUsers = await this.storage.get('users');
  
    if (isLoggedIn) {
      this.router.navigate(['/perfil']);
    } else if (storedUsers && storedUsers.length > 0) {
      this.router.navigate(['/lista-perfil']);
    } else {
      this.router.navigate(['/home']);
    }
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

  mostrarCajasVecinas(): void {
    this.cajasService.getCajasVecinas().subscribe(
      (cajas) => {
        if (!Array.isArray(cajas)) {
          console.error('Los datos obtenidos no son validos:', cajas);
          return;
        }

        cajas.forEach((caja: any) => {
          const latitud = parseFloat(caja.latitud);
          const longitud = parseFloat(caja.longitud);
          const direccion = caja.direccion ?? 'Sin dirección';
          const horario =
            caja.horario ??
            'Lunes a Viernes: 08:00 - 20:00 <br> Sábados: 09:00 - 18:00';

          if (!isNaN(latitud) && !isNaN(longitud)) {
            this.mapService.addMarker(latitud, longitud, direccion, horario);
          } else {
            console.warn('Latitud o longitud no válidas:', caja);
          }
        });
      },
      (error) => {
        console.error('Error al obtener las cajas vecinas:', error);
      }
    );
  }
}
