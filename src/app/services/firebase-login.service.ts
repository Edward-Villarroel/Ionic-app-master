import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/user';
import { Marker } from '../models/marker';

@Injectable({
  providedIn: 'root',
})
export class FirebaseLoginService {
  private usersKey = 'users'; 
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  currentUserRole: string | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private storage: Storage
  ) {
    this.initStorage();
    this.checkAuthState();
  }

  private async initStorage(): Promise<void> {
    await this.storage.create();
  }

  checkAuthState(): Observable<User | null> {
    return this.afAuth.authState.pipe(
      switchMap((firebaseUser) => {
        if (firebaseUser) {
          return this.firestore
            .collection('users-store')
            .doc<User>(firebaseUser.uid)
            .valueChanges()
            .pipe(
              map((userData) => {
                if (!userData) return null;

                return {
                  ...userData,
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || 'Sin email',
                };
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const storedUsers = (await this.storage.get(this.usersKey)) || [];

        const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          lastLogin: new Date().toISOString(),
        };

        if (!storedUsers.some((u: any) => u.uid === newUser.uid)) {
          storedUsers.push(newUser);
          await this.storage.set(this.usersKey, storedUsers);
        }

        console.log('Usuarios almacenados:', storedUsers);
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  }

  async getStoredUsers(): Promise<any[]> {
    return (await this.storage.get(this.usersKey)) || [];
  }

  async removeUser(uid: string): Promise<void> {
    const storedUsers = (await this.storage.get(this.usersKey)) || [];
    const updatedUsers = storedUsers.filter((user: any) => user.uid !== uid);
    await this.storage.set(this.usersKey, updatedUsers);
    console.log('Usuarios actualizados:', updatedUsers);
  }
  async isLoggedIn(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return !!user;
  }

  hasRole(requiredRole: string): boolean {
    return this.currentUserRole === requiredRole;
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.authState.next(false);
      this.currentUserRole = null;
      console.log('Sesión cerrada correctamente.');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  async createUser(
    email: string,
    password: string,
    role: string,
    rut: number
  ): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user: User = {
        uid: userCredential.user?.uid!,
        email: userCredential.user?.email!,
        role: role,
        rut: rut,
        markers: [],
      };

      await this.firestore.collection('users-store').doc(user.uid).set(user);
      console.log('Usuario creado y guardado en Firestore:', user);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }
  getUserRole(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      switchMap((User) => {
        if (User) {
          return this.firestore
            .collection('users-store')
            .doc(User.uid)
            .valueChanges()
            .pipe(map((doc: any) => doc?.role || null));
        } else {
          return of(null);
        }
      })
    );
  }
}
