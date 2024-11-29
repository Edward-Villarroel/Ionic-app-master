import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CajasService {
  private databaseURL = environment.firebaseConfigNueva.databaseURL;

  constructor(private http: HttpClient) {}

  getCajasVecinas(): Observable<any[]> {
    const urlCajasVecinas = `${this.databaseURL}/cajas_vecinas.json`;
    const urlDatosVina = `${this.databaseURL}/datosVina.json`;
    const urlRespuestasSantiago = `${this.databaseURL}/respuestasantiago.json`;
    const urlCajasQuilpue = `${this.databaseURL}/cajasquilpue.json`;

    return forkJoin({
      cajasVecinas: this.http.get<any[]>(urlCajasVecinas),
      datosVina: this.http.get<any[]>(urlDatosVina),
      respuestasSantiago: this.http.get<any[]>(urlRespuestasSantiago),
      cajasquilpue: this.http.get<any[]>(urlCajasQuilpue),
    }).pipe(
      map((responses) => {
        const cajasVecinas = responses.cajasVecinas
          ? Object.values(responses.cajasVecinas)
          : [];
        const datosVina = responses.datosVina
          ? Object.values(responses.datosVina)
          : [];
        const respuestasSantiago = responses.respuestasSantiago
          ? Object.values(responses.respuestasSantiago)
          : [];

        const cajasquilpue = responses.cajasquilpue
          ? Object.values(responses.cajasquilpue)
          : [];

        console.log('Cajas Vecinas:', cajasVecinas);
        console.log('Datos Vina:', datosVina);
        console.log('Respuestas Santiago:', respuestasSantiago);
        console.log('Respuestas Quilpue:', cajasquilpue);

        return [
          ...cajasVecinas,
          ...datosVina,
          ...respuestasSantiago,
          ...cajasquilpue,
        ];
      })
    );
  }
}
