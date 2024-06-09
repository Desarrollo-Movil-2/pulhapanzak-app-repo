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
  signOut,
  sendPasswordResetEmail,
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
import { IUser } from 'src/app/shared/models/user-interface';

const PATH = 'users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      this._auth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  async isUserLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  async createUserWithEmailAndPassword(user: IUser): Promise<UserCredential> {
    const isUserLoggedIn = await this.isUserLoggedIn();
    if (isUserLoggedIn) {
      return Promise.reject('User is already logged in');
    }

    const response: UserCredential = await createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.password
    );
    user.uid = response.user?.uid || '';
    const { password, ...userData } = user;
    await this.createUserInFirestore(userData);
    return response;
  }

  async signInWithEmailAndPassword(model: ILogin): Promise<UserCredential> {
    const isUserLoggedIn = await this.isUserLoggedIn();
    if (isUserLoggedIn) {
      return Promise.reject('User is already logged in');
    }
    return await signInWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    );
  }

  async signInWithGoogle(): Promise<IUser | void> {
    const provider = new GoogleAuthProvider();
    const userCredential: UserCredential = await signInWithPopup(this._auth, provider);
    const user = userCredential.user;

    if (!user) {
      return Promise.reject('No user information found');
    }

    const userExists = await this.getUserByDocId(user.uid);
    if (!userExists) {
      const newUser: IUser = {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        password: '',
        phoneNumber: user.phoneNumber || '',
        identityNumber: '',
        photoUrl: user.photoURL || '',
      };
      const { password, ...userData } = newUser;
      await this.createUserInFirestore(userData);
      return newUser;
    }
  }

  async createUserInFirestore(user: Omit<IUser, 'password'>): Promise<void> {
    const userRef = doc(this._collection, user.uid);
    return setDoc(userRef, {
      uid: user.uid,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      identityNumber: user.identityNumber,
      photoUrl: user.photoUrl,
    });
  }

  updateUser(user: Omit<IUser, 'password'>): Promise<void> {
    if (!user.uid) throw new Error('User must have a uid');

    const userDocument = doc(this._firestore, PATH, user.uid);
    return updateDoc(userDocument, { ...user });
  }

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
      where('uid', '==', uid)
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

  async getUserLoggued() {
    try {
      const user = await this.getCurrentUser();
      const userDocument = doc(this._firestore, PATH, user?.uid ?? '');
      const userSnapshot = await getDoc(userDocument);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as IUser;
        return userData;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    const user = await this.getCurrentUser();
    if (user) {
      return this._auth.signOut();
    }
    return Promise.reject('User not found');
  }

  async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this._auth, email);
  }
}
