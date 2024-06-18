import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonImg,
  IonIcon,
  IonSpinner,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { StorageService } from '../../../../shared/services/storage.services';
import { User } from '@angular/fire/auth';
import { doc, Firestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { IUser } from 'src/app/shared/models/user-interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    ReactiveFormsModule,
    IonImg,
    IonSpinner,
    IonIcon
  ]
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  profileImageUrl: string = 'assets/default-user.png';
  imageChanged: boolean = false;
  isLoading = false;
  loadingData = true;
  private currentUser: User | null = null;
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
      identityNumber: ['', [Validators.required, Validators.minLength(13), Validators.pattern(/^\d+$/)]],
      birthdate: ['', [Validators.required, this.birthDateValidator]],
      deviceId: ['']
    });
    addIcons({ createOutline });
  }

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.currentUser = user;
        this.authService.getUserLoggued().then(userData => {
          if (userData) {
            this.profileForm.patchValue({
              fullName: userData.name,
              phoneNumber: userData.phoneNumber,
              identityNumber: userData.identityNumber,
              birthdate: userData.birthdate ? this.convertTimestampToDate(userData.birthdate) : '',
              deviceId: userData.deviceId || ''
            });
            if (userData.photoUrl) {
              this.profileImageUrl = userData.photoUrl;
            }
          }
          this.loadingData = false;
        }).catch(() => {
          this.loadingData = false; 
        });
      } else {
        this.loadingData = false; 
      }
    });
  }

  get fullName() { return this.profileForm.get('fullName'); }
  get phoneNumber() { return this.profileForm.get('phoneNumber'); }
  get identityNumber() { return this.profileForm.get('identityNumber'); }
  get birthdate() { return this.profileForm.get('birthdate'); }

  get isFullNameInvalid(): boolean { return this.fullName!.invalid && (this.fullName!.dirty || this.fullName!.touched); }
  get isPhoneNumberInvalid(): boolean { return this.phoneNumber!.invalid && (this.phoneNumber!.dirty || this.phoneNumber!.touched); }
  get isIdentityNumberInvalid(): boolean { return this.identityNumber!.invalid && (this.identityNumber!.dirty || this.identityNumber!.touched); }
  get isBirthDateInvalid(): boolean { return this.birthdate!.invalid && (this.birthdate!.dirty || this.birthdate!.touched); }

  async changeProfileImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    if (image && image.dataUrl) {
      this.profileImageUrl = image.dataUrl;
      this.imageChanged = true;
    }
  }

  async confirmSave() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Quieres guardar los cambios?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Sí',
          handler: () => {
            this.saveProfile();
          }
        }
      ]
    });

    await alert.present();
  }

  async saveProfile() {
    if (this.profileForm.valid && (this.imageChanged || this.profileForm.dirty)) {
      this.isLoading = true;
      const { fullName, phoneNumber, identityNumber, birthdate, deviceId } = this.profileForm.value;
      const userDocRef = doc(this.firestore, 'users', this.currentUser!.uid);

      const userProfileUpdate: IUser = {
        uid: this.currentUser!.uid,
        name: fullName,
        email: this.currentUser!.email || '',
        phoneNumber,
        identityNumber,
        photoUrl: this.profileImageUrl,
        birthdate: birthdate ? new Date(birthdate) : null,
        deviceId: deviceId || null
      };

      if (this.imageChanged) {
        const imageUrl = await this.storageService.uploadImage(this.profileImageUrl, `users/${this.currentUser!.uid}`);
        if (imageUrl) {
          userProfileUpdate.photoUrl = imageUrl;
        }
      }

      await this.authService.updateUser(userProfileUpdate);

      this.showToast('Perfil actualizado correctamente', 'success');
      this.isLoading = false;
      this.profileForm.markAsPristine();
      this.imageChanged = false;
    } else {
      this.showToast('Por favor, completa el formulario correctamente', 'danger');
    }
  }

  convertTimestampToDate(timestamp: any): string {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toISOString().split('T')[0];
  }

  birthDateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    return selectedDate > currentDate ? { 'invalidDate': true } : null;
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }

  async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    await toast.present();
  }
}
