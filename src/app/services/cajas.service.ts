import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CajaVecina {
  id?: string;
  nombre: string;
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root',
})
export class CajasService {
  private apiUrl = environment.apiCajasVecinas; // URL de la API desde environment

  constructor(private http: HttpClient) {}

  // Obtener todas las cajas vecinas
  getCajas(): Observable<CajaVecina[]> {
    return this.http.get<CajaVecina[]>(`${this.apiUrl}/cajas.json`); // Agrega .json
  }

  // Agregar una nueva caja vecina
  addCaja(caja: CajaVecina): Observable<CajaVecina> {
    return this.http.post<CajaVecina>(`${this.apiUrl}/cajas.json`, caja); // Agrega .json
  }

  // Eliminar una caja vecina por ID
  deleteCaja(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cajas/${id}.json`); // Agrega .json
  }
}
