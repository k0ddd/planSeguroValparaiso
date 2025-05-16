import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reporte } from '../models/reporte.model';
@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:3000/reportes'; // URL de la API para reportes

  constructor(private http: HttpClient) {}

  // Obtener todos los reportes
  getReportes(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(this.apiUrl);
  }

  // Crear un nuevo reporte
  crearReporte(reporte: any): Observable<any> {
    return this.http.post(this.apiUrl, reporte);
  }

    eliminarReporte(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
