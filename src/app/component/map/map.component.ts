import { Component, AfterViewInit, OnDestroy, Injectable } from '@angular/core';
import * as L from 'leaflet';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Subscription } from 'rxjs';
import { FirebaseLoginService } from 'src/app/services/firebase-login.service';
import { Marker } from 'src/app/models/marker';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-map',
  template: './map.component.html',
  styles: [],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private marker!: L.Marker;
  private positionSubscription!: Subscription;
  private allowMarkerCreation: boolean = false;
  public isTienda: boolean = false;
  private existingMarkers: Marker[] = [];
  private minDistance = 10;

  constructor(
    private geolocationService: GeolocationService,
    private firestore: FirebaseLoginService,
    private firebase: AngularFirestore
  ) {}

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    this.loadExistingMarkers();
    this.checkUserRole();
    this.getCurrentLocation();
    this.map.on('click', async (e: any) => {
      if (!this.isTienda) {
        alert('No tienes permiso para agregar marcadores.');
        return;
      }

      const { lat, lng } = e.latlng;


      const nearbyMarker = this.existingMarkers.some((marker) => {
        const distance = this.calculateDistance(lat, lng, marker.lat, marker.lng);
        return distance < this.minDistance;
      });

      if (nearbyMarker) {
        alert('Ya existe un marcador cerca de esta ubicación.');
        return;
      }

      const titulo = prompt('Ingrese el título del marcador:') ?? 'Sin título';
      const horario = prompt('Ingrese una descripción del marcador:') ?? 'Sin descripción';

      const newMarker = { lat, lng, titulo, horario };

      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(`<strong>${titulo}</strong><br>${horario}`)
        .openPopup();

      this.saveMarkerToFirebase(newMarker);
    });

    setTimeout(() => {
      this.initMap();

    }, 300);
  }

  ngOnDestroy(): void {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  public initMap(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.marker = L.marker([51.505, -0.09]).addTo(this.map);
  }

  public getCurrentLocation(): void {
    this.positionSubscription = this.geolocationService.getCurrentPosition().subscribe(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (this.marker) {
          this.marker.setLatLng([latitude, longitude]);
          this.map.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        console.error('Error obteniendo la ubicación:', error);
      }
    );
  }

  private saveMarkerToFirebase(marker: Marker): void {
    this.firebase
      .collection('markers')
      .add(marker)
      .then(() => {
        console.log('Marcador guardado con éxito');
        this.existingMarkers.push(marker); // Añadir a la lista de marcadores existentes
      })
      .catch((error: any) => console.error('Error guardando marcador:', error));
  }

  private loadExistingMarkers(): void {
    this.firebase
      .collection('markers')
      .get()
      .subscribe((snapshot) => {
        this.existingMarkers = snapshot.docs.map((doc) => doc.data() as Marker);
        this.existingMarkers.forEach((marker) => {
          L.marker([marker.lat, marker.lng])
            .addTo(this.map)
            .bindPopup(`<strong>${marker.titulo}</strong><br>${marker.horario}`);
        });
      });
  }

  private checkUserRole(): void {
    this.firestore.getUserRole().subscribe((role) => {
      this.isTienda = role === 'tienda';
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
