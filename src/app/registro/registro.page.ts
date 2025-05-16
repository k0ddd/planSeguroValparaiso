import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model'; // Adjust the path as needed

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink],
})
export class RegistroPage {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  telefono: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    const nuevoUsuario = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena, // Pasa la contraseña sin encriptar
      telefono: this.telefono,
    };
  
    console.log('Datos enviados al backend:', nuevoUsuario);
  
    this.authService.registrar(nuevoUsuario).subscribe(
      response => {
        console.log('Usuario registrado exitosamente:', response);
        this.router.navigate(['/login']); // Redirige al usuario al login después del registro
      },
      error => {
        console.error('Error al registrar usuario:', error);
      }
    );
  }
}
