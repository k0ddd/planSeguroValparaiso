import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zona } from '../models/zona.model';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {

  private apiUrl = 'http://localhost:3000/zonas';

  constructor(private http: HttpClient) { }

  getZonas(): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.apiUrl);
  }

  getZona(id: string): Observable<Zona> {
    return this.http.get<Zona>(`${this.apiUrl}/${id}`);
  }

  crearZona(zona: Zona): Observable<Zona> {
    return this.http.post<Zona>(this.apiUrl, zona);
  }

  actualizarZona(id: string, zona: Zona): Observable<Zona> {
    return this.http.put<Zona>(`${this.apiUrl}/${id}`, zona);
  }

  eliminarZona(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}