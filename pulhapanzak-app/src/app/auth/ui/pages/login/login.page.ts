import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonInput,
  IonLabel,
  IonButton,
  IonRouterLink,
  IonInputPasswordToggle,
  IonContent,
  IonTitle,
  ToastController,
  IonModal,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { Login } from 'src/app/auth/models/login-interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonLabel,
    IonButton,
    IonRouterLink,
    IonInputPasswordToggle,
    IonContent,
    IonTitle,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonModal,
  ],
})
export class LoginPage implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private toastController = inject(ToastController);
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkActiveSession();
  }

  async checkActiveSession(): Promise<void> {
    const isUserLoggedIn = await this._authService.isUserLoggedIn();
    if (isUserLoggedIn) {
      this._router.navigate(['/tabs']); 
    }
  }

  get isEmailInvalid(): boolean {
    const emailControl = this.loginForm.get('email');
    return (
      (emailControl!.hasError('required') &&
        (emailControl!.dirty || emailControl!.touched)) ||
      (emailControl!.hasError('email') &&
        (emailControl!.dirty || emailControl!.touched))
    );
  }

  get isPasswordInvalid(): boolean {
    const passwordControl = this.loginForm.get('password');
    return (
      passwordControl!.hasError('required') &&
      (passwordControl!.dirty || passwordControl!.touched)
    );
  }

  async onSubmit(): Promise<void> {
    const isUserLoggedIn = await this._authService.isUserLoggedIn();
    if (isUserLoggedIn) {
      this.showAlert('Ya existe una sesión activa', true);
      this._router.navigate(['/tabs']);
    } else {
      if (this.loginForm.valid) {
        const login: Login = {
          email: this.loginForm?.get('email')?.value,
          password: this.loginForm?.get('password')?.value,
        };

        this._authService
          .signInWithEmailAndPassword(login)
          .then(() => {
            this._router.navigate(['/tabs']);
            this.showAlert('Ha iniciado sesión correctamente');
          })
          .catch((error) => {
            this.showAlert('Upps, correo o contraseña inválida', true);
          });
      }
    }
  }

  async showAlert(message: string, error: boolean = false): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      color: error ? 'danger' : 'success',
    });
    await toast.present();
  }
}
