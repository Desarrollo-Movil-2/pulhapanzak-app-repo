import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiRickAndMortyService } from 'src/app/home/services/api-rick-and-morty.service';
import { HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRouterLink, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ICharacter } from 'src/app/home/models/IPersonaje';
import { IUser } from 'src/app/shared/models/user-interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRouterLink,
    RouterLink,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonSpinner
  ],
})
export class HomePage implements OnInit {
  public characters: ICharacter[] = [];
  public cargando: boolean = true;
  user: IUser | null = null;
  private authService = inject(AuthService);
  private apiCharacters = inject(ApiRickAndMortyService);

  constructor() {}

  async ngOnInit() {
    this.user = await this.authService.getUserLoggued();
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.cargando = true;
    this.apiCharacters.getCharacters().subscribe(response => {
      this.characters = response.results;
      this.cargando = false;
    });
  }
}
