import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidente } from '../models/incidente.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentesService {

  private apiUrl = 'http://localhost:3000/incidentes';

  constructor(private http: HttpClient) { }

  getIncidentes(): Observable<Incidente[]> {
    return this.http.get<Incidente[]>(this.apiUrl);
  }

  getIncidente(id: string): Observable<Incidente> {
    return this.http.get<Incidente>(`${this.apiUrl}/${id}`);
  }

  crearIncidente(incidente: Incidente): Observable<Incidente> {
    return this.http.post<Incidente>(this.apiUrl, incidente);
  }

  actualizarIncidente(id: string, incidente: Incidente): Observable<Incidente> {
    return this.http.put<Incidente>(`${this.apiUrl}/${id}`, incidente);
  }

  eliminarIncidente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}