import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:3000/reportes';

  constructor(private http: HttpClient) {}

  crearReporte(reporte: FormData): Observable<any> {
    return this.http.post(this.apiUrl, reporte);
  }

  obtenerReportes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}