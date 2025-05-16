import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IncidenteService {

  private apiUrl = 'http://localhost:3000/incidentes'; // URL de la API

  constructor(private http: HttpClient) { }

  getIncidentes() {
    return this.http.get(this.apiUrl);
  }
  
}
