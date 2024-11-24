import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/compat/firestore'
import { User } from '../models/user';
import { Marker } from '../models/marker';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseLoginService {
  
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  currentUserRole: string | null = null;
  constructor(private afAuth:AngularFireAuth,private router:Router,private firestore:AngularFirestore,afModule:AngularFirestoreModule) { 
    this.afAuth.authState.subscribe((User) => {
      if (User) {
        this.firestore
          .collection('users-store')
          .doc<User>(User.uid)
          .valueChanges()
          .subscribe((doc) => {
            if (doc) {
              this.currentUserRole = doc.role;
            } else {
              this.currentUserRole = null;
              console.error('Usuario no encontrado en la base de datos');
            }
          });
      } else {
        this.currentUserRole = null;
      }
    });
    
  }
  isLoggedIn(): Observable<boolean> {
    return this.authState.pipe(
      map((user) => !!user)
    );
  }
  hasRole(requiredRole: string): boolean {
    return this.currentUserRole === requiredRole;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      if (user) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          lastLogin: new Date().toISOString(), 
        };
  
        if (!users.some((u: any) => u.uid === newUser.uid)) {
          users.push(newUser);
        }
  
        localStorage.setItem('users', JSON.stringify(users));

        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  }
  
  logout(){
     return this.afAuth.signOut().then(()=>{
     this.router.navigate(['/home'])});
  }

  
  public getAuthState(): Observable<any> {
    return this.afAuth.authState;
  }
  async create_store(email:string,password:string,role:string,rut:number){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      const user: User = {
        uid: result.user?.uid!,
        email: result.user?.email!,
        role:role,
        rut:rut,
      };
      
      return this.savestoreToFirestore(user);
    })
    .catch((error) => {
      console.error('Error al registrar usuario:', error);
    });
}

private savestoreToFirestore(user: User) {
  return this.firestore.collection('users').doc(user.uid).set(user)
    .then(() => {
      console.log('Usuario guardado en Firestore:', user);
    })
    .catch((error) => {
      console.error('Error al guardar usuario en Firestore:', error);
    });
  }

  async create_user(email:string,password:string,role:string,rut:number){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then((result) => {
      const user: User = {
        uid: result.user?.uid!,
        email: result.user?.email!,
        role:role,
        rut:rut,
      };
      
      return this.savestoreToFirestore(user);
    })
    .catch((error) => {
      console.error('Error al registrar usuario:', error);
    });
}
  private saveuserToFirestore(user: User) {
    return this.firestore.collection('users').doc(user.email).set(user)
      .then(() => {
        console.log('Usuario guardado en Firestore:', user);
      })
      .catch((error) => {
        console.error('Error al guardar usuario en Firestore:', error);
      });
    }

    getUserRole(): Observable<any> {
      return this.afAuth.authState.pipe(
        switchMap((User) => {
          if (User) {

            return this.firestore
              .collection('users-store')
              .doc(User.uid)
              .valueChanges()
              .pipe(
                map((doc: any) => doc?.role || null)
              );
          } else {
            return of(null);
          }
        })
      );
    }
}
