import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {}

  async checkPermissionsAndLocate() {
    await this.platform.ready();

    if (this.platform.is('capacitor')) {
      // Entorno móvil con Capacitor
      const permissionGranted = await this.checkMobilePermissions();
      if (!permissionGranted) {
        console.error('Permiso de ubicación denegado o GPS deshabilitado.');
        return;
      }
      try {
        const position = await this.geolocation.getCurrentPosition();
        console.log('Ubicación obtenida en app móvil:', position.coords);
      } catch (error) {
        console.error('Error obteniendo ubicación en app móvil:', error);
      }
    } else {
      // Entorno navegador
      if (!navigator.geolocation) {
        console.error(
          'La geolocalización no está soportada en este navegador.'
        );
        return;
      }
      try {
        const position = await this.getBrowserLocation();
        console.log('Ubicación obtenida en navegador:', position.coords);
      } catch (error) {
        console.error('Error obteniendo ubicación en navegador:', error);
      }
    }
  }

  private async checkMobilePermissions(): Promise<boolean> {
    const isLocationEnabled = await this.diagnostic.isLocationEnabled();
    if (!isLocationEnabled) {
      await this.diagnostic.switchToLocationSettings();
      return false;
    }

    const permission = await this.diagnostic.getPermissionAuthorizationStatus(
      this.diagnostic.permission.ACCESS_FINE_LOCATION
    );
    if (permission === this.diagnostic.permissionStatus.GRANTED) {
      return true;
    } else {
      await this.diagnostic.requestRuntimePermission(
        this.diagnostic.permission.ACCESS_FINE_LOCATION
      );
      const updatedPermission =
        await this.diagnostic.getPermissionAuthorizationStatus(
          this.diagnostic.permission.ACCESS_FINE_LOCATION
        );
      return updatedPermission === this.diagnostic.permissionStatus.GRANTED;
    }
  }

  private getBrowserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => observer.next(position),
          (error) => observer.error(error),
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      } else {
        observer.error('Geolocalizacion no lo soporta este navegador');
        return;
      }
    });
  }
}
