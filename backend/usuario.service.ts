import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/usuarios'; // URL de la API

  constructor(private http: HttpClient) { }

  getUsuarios() {
    return this.http.get(this.apiUrl);
  }
}
