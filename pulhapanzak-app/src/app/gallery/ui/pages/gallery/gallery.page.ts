import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GalleryService } from 'src/app/gallery/services/gallery-services';
import { IGallery } from 'src/app/gallery/models/IGallery';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, IonicModule],
})
export class GalleryPage implements OnInit {
  galleries: IGallery[] = [];
  loading = true;
  contentLoaded = false;
  private galleryService = inject(GalleryService);

  constructor() {}

  async ngOnInit() {
    const rawGalleries = await this.galleryService.getActiveGalleries();
    this.galleries = rawGalleries.map(gallery => ({
      ...gallery,
      createdAt: (gallery.createdAt as Timestamp).toDate()
    }));
    if (this.galleries.length === 0) {
      this.loading = false;
    } else {
      this.contentLoaded = true;
    }
  }

  imageLoaded() {
    this.loading = false;
  }
}