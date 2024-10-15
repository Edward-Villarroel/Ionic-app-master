import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class FirebaseLoginService {

  constructor(private afAuth:AngularFireAuth,private router:Router,private firestore:AngularFirestore) { }
  login(email:string,password:string){
    return this.afAuth.signInWithEmailAndPassword(email,password).then(()=>{
      this.router.navigate(['/login'])});;
    
  }
  logout(){
     return this.afAuth.signOut().then(()=>{
     this.router.navigate(['/home'])});
  }


  async create_user(email:string,password:string,role:string,rut:number){
      const userCredential=await this.afAuth.createUserWithEmailAndPassword(email,password);
      const uid=userCredential.user?.uid;

      await this.firestore.doc('users/$(uid)').set({
        email:email,
        rut:rut,
        uid:uid,
        role:role
      });
      return userCredential;

  }
}
