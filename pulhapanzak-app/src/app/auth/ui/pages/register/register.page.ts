import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../../Models/IUser';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonRouterLink,
  IonInputPasswordToggle,
  AlertController
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonRouterLink,
    IonInputPasswordToggle
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private alertController = inject(AlertController);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      identityNumber: ['', [Validators.required, Validators.minLength(13), Validators.pattern(/^\d+$/)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]]
    });
  }

  get isFirstNameInvalid(): boolean { return this.registerForm.get('firstName')!.invalid && (this.registerForm.get('firstName')!.dirty || this.registerForm.get('firstName')!.touched); }
  get isLastNameInvalid(): boolean { return this.registerForm.get('lastName')!.invalid && (this.registerForm.get('lastName')!.dirty || this.registerForm.get('lastName')!.touched); }
  get isEmailInvalid(): boolean { return this.registerForm.get('email')!.invalid && (this.registerForm.get('email')!.dirty || this.registerForm.get('email')!.touched); }
  get isPasswordInvalid(): boolean { return this.registerForm.get('password')!.invalid && (this.registerForm.get('password')!.dirty || this.registerForm.get('password')!.touched); }
  get isIdentityNumberInvalid(): boolean { return this.registerForm.get('identityNumber')!.invalid && (this.registerForm.get('identityNumber')!.dirty || this.registerForm.get('identityNumber')!.touched); }
  get isPhoneNumberInvalid(): boolean { return this.registerForm.get('phoneNumber')!.invalid && (this.registerForm.get('phoneNumber')!.dirty || this.registerForm.get('phoneNumber')!.touched); }

  onSubmit = (): void => {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      console.log('User Registered:', user);
    }
  }

  onGoogleLogin = async (): Promise<void> => {
    try {
      await this._authService.signInWithGoogle();
      this._router.navigate(['']);
    } catch (error) {
      this.showAlert('Error al iniciar sesión con Google');
      console.error('Error al iniciar sesión con Google', error);
    }
  };

  showAlert = async (message: string): Promise<void> => {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  };
}
