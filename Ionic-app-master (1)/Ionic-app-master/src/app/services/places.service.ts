import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  useLocation: [number, number] = [-71.551, -33.0244]; // Ejemplo de coordenadas para Viña del Mar

  constructor() {}
}
