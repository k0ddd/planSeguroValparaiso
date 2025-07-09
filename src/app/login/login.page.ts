import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router'; // Agregar Router aquí
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonButton, IonInput, IonItem, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, FormsModule, RouterLink, HttpClientModule 
]
})
export class LoginPage implements OnInit {

  correo: string = '';  // Variable para el correo
  contrasena: string = '';  // Variable para la contraseña
  animatingOut = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    // Resetea la animación si el usuario vuelve a esta página
    this.animatingOut = false;
  }
  // Método que se ejecuta cuando el usuario hace click en el botón de login
  async login() {
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.contrasena);
    console.log('Contraseña recibida en el backend:', this.contrasena);

    this.authService.login(this.correo, this.contrasena).subscribe(
      response => {
        if (response && response.token) {
          this.authService.guardarToken(response.token);
          this.authService.setUsuario(response.usuario); // Asegúrate de guardar los datos del usuario
          console.log('Usuario guardado:', response.usuario);
          this.router.navigate(['/home']);
          console.log('Inicio de sesión exitoso', response.usuario);
          
        }
      },
      error => {
        console.error('Error al iniciar sesión', error);
      }
    );
  }

    irARegistro() {
    this.animatingOut = true;
    setTimeout(() => {
      this.router.navigate(['/registro']);
    }, 300); // Debe coincidir con la duración de la animación de salida
  }
}