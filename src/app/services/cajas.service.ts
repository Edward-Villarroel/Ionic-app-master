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
  private apiUrl = environment.apiCajasVecinas;

  constructor(private http: HttpClient) {}

  getCajas(): Observable<CajaVecina[]> {
    return this.http.get<CajaVecina[]>(`${this.apiUrl}/cajas.json`);
  }
  addCaja(caja: CajaVecina): Observable<CajaVecina> {
    return this.http.post<CajaVecina>(`${this.apiUrl}/cajas.json`, caja);
  }
  deleteCaja(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cajas/${id}.json`);
  }
}
