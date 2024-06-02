import { Injectable, inject } from '@angular/core';
import { Login } from '../models/login-interface';
import { Auth, UserCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from '@angular/fire/auth';

const PATH = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth)
  // private _firestore = inject(Firestore);

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      this._auth.onAuthStateChanged(user => {
        console.log(user);
        resolve(user);
      });
    });
  }

  async isUserLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  async createUserWithEmailAndPassword(model: Login): Promise<UserCredential> {
    const isUserLoggedIn = await this.isUserLoggedIn();
    if (isUserLoggedIn) {
      return Promise.reject('User is already logged in');
    }
    return await createUserWithEmailAndPassword(this._auth, model.email, model.password);
  }

  async signInWithEmailAndPassword(model: Login): Promise<UserCredential> {
    const isUserLoggedIn = await this.isUserLoggedIn();
    if (isUserLoggedIn) {
      return Promise.reject('User is already logged in');
    }
    return await signInWithEmailAndPassword(this._auth, model.email, model.password);
  }
}
