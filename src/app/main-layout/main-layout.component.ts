import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonContent, IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import {
  homeOutline, cameraOutline, chatboxEllipsesOutline, personOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet, RouterLink,
    IonContent, IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel,
    NgClass
  ],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
          })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('300ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true }),
        ])
      ])
    ])
  ]
})
export class MainLayoutComponent {
  constructor(public router: Router) {
    addIcons({ homeOutline, cameraOutline, chatboxEllipsesOutline, personOutline });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
