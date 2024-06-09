import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from '@angular/fire/storage';

const PATH = 'users';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage = inject(Storage);

  async uploadImage(imageSrc: string, url: string): Promise<string | null> {
    try {
      const storageRef = ref(this._storage, `${url}.jpg`);

      const existingFile = await getDownloadURL(storageRef).catch(() => null);
      if (existingFile) {
        await deleteObject(ref(this._storage, existingFile));
      }

      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
  }
}
