import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseLoginService } from '../services/firebase-login.service';
import { AlertController } from '@ionic/angular';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class loggedGuard {
  constructor(
    private firebase: FirebaseLoginService,
    private route: Router,
    private alertController: AlertController
  ) {}

  canActivate(route: any, state: any): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.firebase.isLoggedIn().subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          observer.next(true); 
          observer.complete(); 
        } else {
          this.showAlert().then(() => {
            observer.next(false); 
            observer.complete(); 
          });
          
        }
      });
    });
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'no tienes una sesion iniciada',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
        {
          text: 'Iniciar sesion',
          role: 'loggin',
          handler: async () => {
            this.route.navigate(['/home']);
          },
        },
      ],
    });
    await alert.present();
  }
}
