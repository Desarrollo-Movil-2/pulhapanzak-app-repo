import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where, orderBy } from '@angular/fire/firestore';
import { IGallery } from '../models/IGallery';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, 'galleries');

  async getActiveGalleries(): Promise<IGallery[]> {
    const galleriesQuery = query(this._collection, where('active', '==', true), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(galleriesQuery);
    return querySnapshot.docs.map(doc => doc.data() as IGallery);
  }
}
