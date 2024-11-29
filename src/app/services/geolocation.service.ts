import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(
    private geolocation:Geolocation,
    private diagnostic: Diagnostic,
    private platform: Platform
  ) {}
  async checkPermissionsAndLocate() {
    await this.platform.ready();
  
    const permission = await this.diagnostic.isLocationEnabled();
    if (!permission) {
      this.diagnostic.switchToLocationSettings();
      return;
    }
  
    try {
      const position = await this.geolocation.getCurrentPosition();
      console.log('Ubicación obtenida:', position.coords);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }
  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => observer.next(position),
          (error) => observer.error(error),
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        observer.error('Geolocation is not supported by this browser');
      }
    });
  }
  
}
