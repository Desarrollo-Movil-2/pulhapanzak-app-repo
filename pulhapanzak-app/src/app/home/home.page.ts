import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRouterLink, } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRouterLink, RouterLink],
})
export class HomePage {
  constructor() {}
}
