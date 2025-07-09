import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular, createAnimation } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { HttpClientModule } from '@angular/common/http'; 



export function slideAnimation(baseEl: any, opts?: any) {
  const OFF_RIGHT = 'translateX(100%)';
  const CENTER = 'translateX(0)';
  const OFF_LEFT = 'translateX(-30%)';

  const enteringEl = baseEl.querySelector(':scope > .ion-page');
  const leavingEl = baseEl.querySelector(':scope > .ion-page[aria-hidden="true"]');

  const enteringAnimation = createAnimation()
    .addElement(enteringEl)
    .beforeStyles({ opacity: 1 })
    .fromTo('transform', OFF_RIGHT, CENTER)
    .fromTo('opacity', 0.8, 1);

  const leavingAnimation = createAnimation()
    .addElement(leavingEl)
    .fromTo('transform', CENTER, OFF_LEFT)
    .fromTo('opacity', 1, 0.8);

  return createAnimation()
    .addAnimation([enteringAnimation, leavingAnimation])
    .duration(400)
    .easing('cubic-bezier(0.36,0.66,0.04,1)');
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      navAnimation: slideAnimation
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    AuthService,
    AuthGuard,
  ],
});
