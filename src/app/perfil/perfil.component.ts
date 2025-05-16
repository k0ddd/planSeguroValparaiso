import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonTabButton, IonFooter, IonTabBar, IonLabel, IonSearchbar, IonTabs, IonMenu, IonAvatar } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import {
  personOutline, homeOutline, settingsOutline, chatboxEllipsesOutline,
  cameraOutline, reorderFourOutline, optionsOutline
} from 'ionicons/icons';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  imports: [IonAvatar, IonTabs, IonTabButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonTabBar, IonIcon, IonLabel, IonSearchbar, IonMenu, IonAvatar],
})
export class PerfilComponent  implements OnInit {
  usuario: any;
  correo: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({
      personOutline, homeOutline, settingsOutline,
      chatboxEllipsesOutline, cameraOutline, reorderFourOutline, optionsOutline
    });
  }

  cerrarSesion() {
    this.authService.eliminarToken();
    console.log('Token eliminado del almacenamiento local');
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
  }

  verMisReportes() {
  this.router.navigate(['/comentario'], { queryParams: { soloMios: true } });
}  
}
