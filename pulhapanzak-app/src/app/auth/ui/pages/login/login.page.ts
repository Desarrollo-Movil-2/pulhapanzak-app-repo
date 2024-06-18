import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonInput, IonLabel, IonButton, IonRouterLink, IonInputPasswordToggle, IonContent, IonTitle, IonModal, AlertController } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from 'src/app/auth/models/login-interface';
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
  private alertController = inject(AlertController);
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit = (): void => {
    this.checkActiveSession();
  };

  checkActiveSession = async (): Promise<void> => {
    const isUserLoggedIn = await this._authService.isUserLoggedIn();
    if (isUserLoggedIn) {
      this._router.navigate(['']);
    }
  };

  get isEmailRequired(): boolean {
    const emailControl = this.loginForm.get('email');
    return emailControl!.hasError('required') && (emailControl!.dirty || emailControl!.touched);
  }

  get isEmailFormatInvalid(): boolean {
    const emailControl = this.loginForm.get('email');
    return emailControl!.hasError('email') && (emailControl!.dirty || emailControl!.touched);
  }

  get isPasswordRequired(): boolean {
    const passwordControl = this.loginForm.get('password');
    return passwordControl!.hasError('required') && (passwordControl!.dirty || passwordControl!.touched);
  }

  onSubmit = async (): Promise<void> => {
    const isUserLoggedIn = await this._authService.isUserLoggedIn();
    if (isUserLoggedIn) {
      this._router.navigate(['']);
    } else {
      if (this.loginForm.valid) {
        const login: ILogin = {
          email: this.loginForm?.get('email')?.value,
          password: this.loginForm?.get('password')?.value,
        };

        this._authService
          .signInWithEmailAndPassword(login)
          .then(() => {
            this._router.navigate(['']);
          })
          .catch((error) => {
            this.showAlert('Upps, correo o contraseña inválida');
            console.error('Upps, correo o contraseña inválida', error);
          });
      }
    }
  };

  onGoogleLogin = async (): Promise<void> => {
    try {
      await this._authService.signInWithGoogle();
      this._router.navigate(['']);
    } catch (error) {
      this.showAlert('Error al iniciar sesión con Google');
      console.error('Error al iniciar sesión con Google', error);
    }
  };

  onForgotPassword = async (): Promise<void> => {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.showAlert('Por favor, introduce tu correo electrónico');
      return;
    }

    try {
      await this._authService.resetPassword(email);
      this.showAlert('Correo de restablecimiento de contraseña enviado. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      this.showAlert('Error al enviar el correo de restablecimiento de contraseña');
      console.error('Error al enviar el correo de restablecimiento de contraseña', error);
    }
  };

  showAlert = async (message: string): Promise<void> => {
    const alert = await this.alertController.create({
      header: 'Información',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  };
}
