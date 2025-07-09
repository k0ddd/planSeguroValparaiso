import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonButton, AlertController, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, IonBackButton, IonButtons, HttpClientModule],
})
export class RegistroPage {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  telefono: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

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
        this.presentSuccessAlert();
      },
      error => {
        console.error('Error al registrar usuario:', error);
      }
    );
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: 'Registrado Correctamente',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}
