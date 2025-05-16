import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonContent, IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import {
  homeOutline, cameraOutline, chatboxEllipsesOutline, personOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet, RouterLink,
    IonContent, IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel
  ]
})
export class MainLayoutComponent {
  constructor() {
    addIcons({ homeOutline, cameraOutline, chatboxEllipsesOutline, personOutline });
  }
}
