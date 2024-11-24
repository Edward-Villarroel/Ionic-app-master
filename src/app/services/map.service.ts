import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Marker } from 'src/app/models/marker';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { FirebaseLoginService } from 'src/app/services/firebase-login.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;
  private marker!: L.Marker;
  private markers: Marker[] = [];
  private readonly mapSubject = new BehaviorSubject<L.Map | null>(null);
  private isTienda: boolean = false;
  private minDistance = 10;
  private geolocationMarker!: L.Marker;
  private positionSubscription!: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private geolocationService: GeolocationService,
    private firebaseLoginService: FirebaseLoginService
  ) {}
  

  initializeMap(containerId: string, lat: number, lng: number, zoom: number = 13): void {
    this.map = L.map(containerId).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.mapSubject.next(this.map);

    this.loadMarkers();
    this.checkUserRole();
    this.addMapClickListener();
  }

  private checkUserRole(): void {
    this.firebaseLoginService.getUserRole().subscribe((role) => {
      this.isTienda = role === 'tienda';
    });
  }
  
  public isMarkerNearby(lat: number, lng: number, minDistance: number): boolean {
    return this.markers.some((marker: { lat: number; lng: number; }) => {
      const distance = this.calculateDistance(lat, lng, marker.lat, marker.lng);
      return distance < minDistance;
    });
  }
  private addMapClickListener(): void {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (!this.isTienda) {
        alert('No tienes permiso para agregar marcadores.');
        return;
      }
      

      const { lat, lng } = e.latlng;

      if (this.isMarkerNearby(lat, lng, this.minDistance)) {
        alert('Ya existe un marcador cerca de esta ubicación.');
        return;
      }


      const titulo = prompt('Ingrese el título del marcador:') ?? 'Sin título';
      const horario = prompt('Ingrese horarios ordinarios de la tienda') ?? 'Sin horario';

      this.addMarker(lat, lng, titulo, horario);
    });
  }

  updateMarkerPosition(lat: number, lng: number): void {
    if (!this.marker) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    } else {
      this.marker.setLatLng([lat, lng]);
    }
    this.map.setView([lat, lng], this.map.getZoom());
  }


  public getCurrentLocation(): void {
    this.positionSubscription = this.geolocationService.getCurrentPosition().subscribe(
      (position) => {
        const { latitude, longitude } = position.coords;
    

        if (!this.geolocationMarker) {
          this.geolocationMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: '../../../assets/icon/geomarker.png',
              iconSize: [41, 41],
              iconAnchor: [12, 41],
              shadowSize: [41, 41],
            }),
          }).addTo(this.map)
            .bindPopup('Estás aquí')
            .openPopup();
        } else {

          this.geolocationMarker.setLatLng([latitude, longitude]);
        }
    

        this.map.setView([latitude, longitude], 13);
      },
      (error) => {
        console.error('Error obteniendo la ubicación:', error);
      }
    );
  }

  addMarker(lat: number, lng: number, titulo: string, horario: string): void {
    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(`<strong>${titulo}</strong><br>${horario}`)
      .openPopup();

    this.saveMarkerToFirebase({ lat, lng, titulo, horario });
  }


  public loadMarkers(): void {
    this.firestore
      .collection('markers')
      .get()
      .subscribe((snapshot) => {
        this.markers = snapshot.docs.map((doc) => doc.data() as Marker);
        this.markers.forEach((marker) => {
          L.marker([marker.lat, marker.lng])
            .addTo(this.map)
            .bindPopup(`<strong>${marker.titulo}</strong><br>${marker.horario}`);
        });
      });
  }

  private saveMarkerToFirebase(marker: Marker): void {
    this.firestore.collection('markers').add(marker).then(() => {
      console.log('Marcador guardado con éxito');
      this.markers.push(marker); 
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
