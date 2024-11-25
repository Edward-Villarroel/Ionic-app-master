import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseLoginService } from '../services/firebase-login.service';
import { AlertController } from '@ionic/angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private firebase: FirebaseLoginService,
    private route: Router,
    private alertController: AlertController
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.firebase.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          this.showAlert()
          return false;
        } else {
          return true;
        }
      })
    );
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: '¡Ya tienes una sesión iniciada!',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: async () => {
            await this.firebase.logout();
            this.route.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }
}
