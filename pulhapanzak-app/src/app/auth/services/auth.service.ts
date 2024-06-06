import { Injectable, inject } from '@angular/core';
import { ILogin } from '../models/login-interface';
import {
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  setDoc,
  where,
  getDocs,
  getDoc,
} from '@angular/fire/firestore';
import { IUser } from '../models/user-interface';

const PATH = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  // Método para obtener el usuario actual de la sesión
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

  // Método para registrar un usuario con correo y contraseña
  async createUserWithEmailAndPassword(model: ILogin): Promise<UserCredential> {
    const isUserLoggedIn = await this.isUserLoggedIn();
    if (isUserLoggedIn) {
      return Promise.reject('User is already logged in');
    }
    const response: UserCredential = await createUserWithEmailAndPassword(this._auth, model.email, model.password);
    const user: IUser = {
      uid: response.user?.uid || '',
      email: model.email,
      password: model.password,
      phoneNumber: '',  
      name: '',  
      role: 'user',
      photoUrl: ''
    };
    await this.createUserInFirestore(user);
    return response;
  }

  // Método para iniciar sesión con correo y contraseña
  async signInWithEmailAndPassword(model: ILogin): Promise<UserCredential> {
    const isUserLoggedIn = await this.isUserLoggedIn();
    if (isUserLoggedIn) {
      return Promise.reject('User is already logged in');
    }
    return await signInWithEmailAndPassword(this._auth, model.email, model.password);
  }

  // Método para iniciar sesión con Google
  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(this._auth, provider);
  }

  // Método para cerrar sesión
  async signOut(): Promise<void> {
    await signOut(this._auth);
  }

  // Método para crear un usuario en Firestore
  async createUserInFirestore(user: IUser): Promise<void> {
    const userRef = doc(this._collection, user.uid);
    return setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      role: 'user',
      photoUrl: user.photoUrl,
    });
  }

  // Método para actualizar un usuario en Firestore
  async updateUserInFirestore(user: IUser): Promise<void> {
    if (!user.uid) {
      return Promise.reject('User id is required');
    }

    const userRef = doc(this._collection, user.uid);
    return updateDoc(userRef, {
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name,
      photoUrl: user.photoUrl,
    });
  }

  // Método para eliminar un usuario en Firestore
  async deleteUserInFirestore(uid: string): Promise<void> {
    if (!uid) {
      return Promise.reject('User id is required');
    }

    const userRef = doc(this._collection, uid);
    await deleteDoc(userRef);
  }

  async getUserByQueryId(uid: string): Promise<IUser | null> {
    const userQuery = query(
      this._collection,
      where('uid', '==', uid),
      where('age', '>=', 27), // Ajustar según tus necesidades
      where('role', '==', 'user')
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      return null;
    }

    const user = userSnapshot.docs[0].data() as IUser;
    return user;
  }

  async getUserByDocId(uid: string): Promise<IUser | null> {
    const userRef = doc(this._collection, uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      return null;
    }

    const user = userSnapshot.data() as IUser;
    return user;
  }
}
