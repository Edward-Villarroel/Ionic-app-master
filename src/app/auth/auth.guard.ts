import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseLoginService } from '../services/firebase-login.service';
import { AlertController } from '@ionic/angular';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private firebase: FirebaseLoginService,
    private route: Router,
    private alertController: AlertController
  ) {}

  canActivate(route: any, state: any): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.firebase.isLoggedIn().subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.showAlert().then(() => {
            observer.next(false); 
            observer.complete(); 
          });
        } else {

          observer.next(true); 
          observer.complete(); 
        }
      });
    });
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
