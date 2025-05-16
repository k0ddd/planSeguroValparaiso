import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  private apiUrl = 'http://localhost:3000/zonas'; // URL de la API

  constructor(private http: HttpClient) { }

  getZonas() {
    return this.http.get(this.apiUrl);
  }
}
