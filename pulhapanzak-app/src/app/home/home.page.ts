import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRouterLink } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IUser } from 'src/app/shared/models/user-interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRouterLink, RouterLink],
})
export class HomePage implements OnInit {
  user: IUser | null = null;
  private authService = inject(AuthService);

  constructor() {}

  async ngOnInit() {
    this.user = await this.authService.getUserLoggued();
  }
}
