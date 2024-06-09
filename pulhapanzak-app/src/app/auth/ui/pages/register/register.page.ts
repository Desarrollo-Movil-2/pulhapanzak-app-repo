import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IUser } from 'src/app/shared/models/user-interface';
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
  ToastController,
  IonImg,
  IonSpinner
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/auth/services/auth.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    IonInputPasswordToggle,
    IonImg,
    IonSpinner
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  fileName: string | null = null;
  isLoading = false;
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private toastController = inject(ToastController);

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { firstName, lastName, ...rest } = this.registerForm.value;
      const name = `${firstName} ${lastName}`;

      try {
        const user: IUser = {
          ...rest,
          name,
          photoUrl: ''
        };

        const userCredential = await this._authService.createUserWithEmailAndPassword(user);

        if (this.selectedFile) {
          const storage = getStorage();
          const storageRef = ref(storage, `profile_pictures/${userCredential.user.uid}/${this.selectedFile.name}`);
          await uploadBytes(storageRef, this.selectedFile);
          const photoUrl = await getDownloadURL(storageRef);

          const updatedUser: Omit<IUser, 'password'> = {
            ...user,
            photoUrl
          };
          await this._authService.updateUser(updatedUser);
        }

        this.showToast('Usuario registrado correctamente', 'success');
        this._router.navigate(['/home']);
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        this.showToast('Error al registrar el usuario', 'danger');
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onGoogleRegister(): Promise<void> {
    try {
      this.isLoading = true;
      const userDto = await this._authService.signInWithGoogle();
      if (userDto) {
        this.showToast('Usuario registrado con Google correctamente', 'success');
        this._router.navigate(['tabs/home']);
      }
    } catch (error) {
      console.error('Error al registrar con Google:', error);
      this.showToast('Error al registrar con Google', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    await toast.present();
  }

  onGoogleLogin = async (): Promise<void> => {
    try {
      this.isLoading = true;
      await this._authService.signInWithGoogle();
      this._router.navigate(['tabs/home']);
    } catch (error) {
      this.showToast('Error al iniciar sesión con Google', 'danger');
      console.error('Error al iniciar sesión con Google:', error);
    } finally {
      this.isLoading = false; 
    }
  };
}
