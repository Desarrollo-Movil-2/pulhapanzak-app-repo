import { Timestamp } from '@angular/fire/firestore';

export interface IGallery {
  active: boolean;
  createdAt: Timestamp | Date; 
  createBy: string;
  description: string;
  photo: string;
  placeName: string;
  uid: string;
}
