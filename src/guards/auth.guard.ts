import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../app/services/auth.service'; // Asegúrate de que la ruta esté correcta
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.obtenerToken();
    console.log('TOKEN EN GUARD:', token); // 👈 AÑADE ESTO
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
