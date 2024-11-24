import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {}

  reauthenticate(currentPassword: string) {
    return this.afAuth.currentUser.then(user => {
      if (user && user.email) {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(credential);
      } else {
        throw new Error('No se ha iniciado sesión.');
      }
    });
  }

  updatePassword(newPassword: string) {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return user.updatePassword(newPassword);
      } else {
        throw new Error('No se ha iniciado sesión.');
      }
    });
  }
}
