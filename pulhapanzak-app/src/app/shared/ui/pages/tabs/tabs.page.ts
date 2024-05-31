import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonLabel} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {homeOutline, personOutline, imageOutline} from 'ionicons/icons'

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonTabs, CommonModule, FormsModule, IonIcon, IonLabel]
})
export class TabsPage {

  constructor() {
    addIcons({homeOutline, personOutline, imageOutline})
  }



}
