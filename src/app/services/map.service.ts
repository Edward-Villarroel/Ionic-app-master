import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Marker } from 'src/app/models/marker';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { FirebaseLoginService } from 'src/app/services/firebase-login.service';
import { Storage } from '@ionic/storage-angular';
import { arrayUnion, doc, FieldValue, updateDoc } from 'firebase/firestore'; // Importar FieldValue correctamente
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private cajaVecinaIcon = L.icon({
    iconUrl: 'assets/icon/cajavecinaLOGOMARCADOR.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  private map!: L.Map;
  private marker!: L.Marker;
  private markers: Marker[] = [];
  private readonly mapSubject = new BehaviorSubject<L.Map | null>(null);
  private isTienda: boolean = false;
  private minDistance = 10;
  private geolocationMarker!: L.Marker;
  private positionSubscription!: Subscription;
  private currentUser: any;

  constructor(
    private firestore: AngularFirestore,
    private geolocationService: GeolocationService,
    private firebaseLoginService: FirebaseLoginService,
    private storage: Storage
  ) {
    this.firebaseLoginService.checkAuthState().subscribe((user) => {
      this.currentUser = user;
    });
  }

  async initializeMap(
    containerId: string,
    lat: number,
    lng: number,
    zoom: number = 13
  ): Promise<void> {
    this.map = L.map(containerId).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.mapSubject.next(this.map);

    await this.loadMarkers();
    await this.checkUserRole();
  }

  public checkUserRole(): void {
    this.firebaseLoginService.getUserRole().subscribe((role) => {
      this.isTienda = role === 'tienda';
      console.log('Rol del usuario:', role, 'Es tienda:', this.isTienda);
    });
  }

  public isMarkerNearby(
    lat: number,
    lng: number,
    minDistance: number
  ): boolean {
    return this.markers.some((marker: { lat: number; lng: number }) => {
      const distance = this.calculateDistance(lat, lng, marker.lat, marker.lng);
      return distance < minDistance;
    });
  }

  public enableAddMarkerMode(): void {
    alert('Haga clic en el mapa para agregar un marcador.');
  
    const clickHandler = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
  
      const titulo = prompt('Ingrese el título del marcador:') ?? 'Sin título';
      const horario =
        prompt('Ingrese horarios ordinarios de la tienda') ?? 'Sin horario';
  
      this.addMarker(lat, lng, titulo, horario); 
  

      this.map.off('click', clickHandler);
      alert('Marcador agregado.');
    };
  

    this.map.on('click', clickHandler);
  }
  

  async addMarker(
    lat: number,
    lng: number,
    titulo: string,
    horario: string
  ): Promise<void> {
    const marker: Marker = { lat, lng, titulo, horario };
    
    L.marker([lat, lng], { icon: this.cajaVecinaIcon })
      .addTo(this.map)
      .bindPopup(`<strong>${titulo}</strong><br>${horario}`)
      .openPopup();

    await this.saveMarkerToFirebase(marker);
  }

  private async saveMarkerToFirebase(marker: Marker): Promise<void> {
    if (!this.currentUser) {
      console.error(
        'No hay usuario autenticado al intentar guardar el marcador'
      );
      return;
    }

    try {
      const userRef = doc(
        this.firestore.firestore,
        'users-store',
        this.currentUser.uid
      );

      await updateDoc(userRef, {
        markers: arrayUnion(marker),
      });

      console.log(
        'Marcador guardado en el documento del usuario:',
        this.currentUser.uid
      );

      const markerDocRef = this.firestore.collection('markers').doc();
      await markerDocRef.set({
        ...marker,
        userId: this.currentUser.uid,
        timestamp: new Date().toISOString(),
      });
      console.log('Marcador guardado en la colección "markers"');
    } catch (error) {
      console.error('Error al guardar el marcador:', error);
    }
  }
  public centerMapOnMarker(marker: Marker): void {
    if (!this.map) {
      console.error('El mapa no está inicializado.');
      return;
    }
    this.map.setView([marker.lat, marker.lng], 13);

    const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(this.map);

    leafletMarker
      .bindPopup(`<strong>${marker.titulo}</strong><br>${marker.horario}`)
      .openPopup();
  }
  public centerMapOnUser():void{
    if (this.geolocationMarker) {
      const latLng = this.geolocationMarker.getLatLng();
      this.map.setView(latLng, 13);
    } else {
      console.log('El marcador de geolocalización no está disponible.');
    }
  }
  public async loadMarkers(): Promise<void> {
    try {
      const markersSnapshot = await this.firestore
        .collection('markers')
        .get()
        .toPromise();
      if (markersSnapshot?.empty) {
        console.log('No se encontraron marcadores en la colección "markers".');
        return;
      }

      markersSnapshot?.forEach((doc) => {
        const marker = doc.data() as Marker;

        const leafletMarker = L.marker([marker.lat, marker.lng], {
          icon: this.cajaVecinaIcon,
        })
          .addTo(this.map)
          .bindPopup(`<strong>${marker.titulo}</strong><br>${marker.horario}`);
        leafletMarker.on('click', () => {
          this.onMarkerClick(marker);
        });
      });

      console.log('Marcadores cargados desde la colección "markers".');
    } catch (error) {
      console.error(
        'Error al cargar marcadores desde la colección "markers":',
        error
      );
    }
  }

  private onMarkerClick(marker: Marker): void {
    let popupContent = `
      <div>
        <h4>${marker.titulo}</h4>
        <p>${marker.horario}</p>
        ${this.currentUser?.role === 'persona' ? `
          <button 
            class="popup-save-marker-btn" 
            style="
              display: block; 
              margin-top: 5px; 
              padding: 10px 15px; 
              background-color: #ffc107; 
              border: none; 
              color: white; 
              font-size: 14px; 
              border-radius: 5px; 
              cursor: pointer;">
            Guardar Marcador
          </button>
        ` : ''}
      </div>`;
  
    const leafletMarker = L.marker([marker.lat, marker.lng], {
      icon: this.cajaVecinaIcon,
    }).addTo(this.map);
  
    leafletMarker.bindPopup(popupContent);
  
    leafletMarker.on('click', (event) => {
      event.target.bindPopup(popupContent).openPopup();
  
      const saveButton = event.target._popup?.getElement()?.querySelector('.popup-save-marker-btn');
      
      if (saveButton) {
        saveButton.addEventListener('click', () => {
          this.saveMarkerToFirebase(marker); 
        });
      }
    });
  }
  private async saveMarkerForUser(marker: Marker): Promise<void> {
    if (!this.currentUser) {
      console.error('No hay usuario autenticado al intentar guardar el marcador');
      return;
    }
  
    try {
      const userRef = doc(
        this.firestore.firestore,
        'users-store',
        this.currentUser.uid
      );
      await updateDoc(userRef, {
        markers: arrayUnion(marker),
      });
  
      console.log('Marcador guardado en el perfil del usuario.');
    } catch (error) {
      console.error('Error al guardar el marcador:', error);
    }
  }
  
  
  

  public getCurrentLocation(): void {
    this.positionSubscription = this.geolocationService
      .getCurrentPosition()
      .subscribe(
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
            })
              .addTo(this.map)
              .bindPopup('Estás aquí')
              .openPopup();
          } else {
            this.geolocationMarker.setLatLng([latitude, longitude]);
          }
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
        }
      );
  }

  public calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
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
  public async getUserMarkers(): Promise<Marker[]> {
    if (!this.currentUser) {
      console.error('No hay usuario autenticado');
      return [];
    }

    try {
      const markersSnapshot = await this.firestore
        .collection('markers', (ref) =>
          ref.where('userId', '==', this.currentUser.uid)
        )
        .get()
        .toPromise();

      const markers: Marker[] = [];
      markersSnapshot?.forEach((doc) => {
        const marker = doc.data() as Marker;
        markers.push(marker);
      });
  
      return markers;
    } catch (error) {
      console.error('Error al obtener los marcadores del usuario:', error);
      return [];
    }
  }
  
}
