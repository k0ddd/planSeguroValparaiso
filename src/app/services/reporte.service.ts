import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reporte } from '../models/reporte.model';
@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  // 🔧 CAMBIAR la URL base
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtener todos los reportes
  getReportes(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.apiUrl}/reportes`);
  }

  // Crear un nuevo reporte
  crearReporte(reporte: any): Observable<any> {
    console.log('📤 Enviando reporte al backend');
    
    // 🔧 Si ya es FormData, enviarlo directamente
    if (reporte instanceof FormData) {
      return this.http.post(`${this.apiUrl}/reportes`, reporte);
    }
    
    // 🔧 Si es objeto, convertir a FormData (para compatibilidad con HOME)
    const formData = new FormData();
    formData.append('tipo', reporte.tipo);
    formData.append('descripcion', reporte.descripcion);
    formData.append('latitud', reporte.latitud.toString());
    formData.append('longitud', reporte.longitud.toString());
    formData.append('fecha', reporte.fecha.toISOString());
    
    if (reporte.imagen) {
      formData.append('imagen', reporte.imagen);
    }
    
    return this.http.post(`${this.apiUrl}/reportes`, formData);
  }

  eliminarReporte(id: string) {
    return this.http.delete(`${this.apiUrl}/reportes/${id}`);
  }
}
