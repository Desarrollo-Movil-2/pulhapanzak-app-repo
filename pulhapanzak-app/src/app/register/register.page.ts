import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../Models/IUser';
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
} from '@ionic/angular/standalone';

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
    ReactiveFormsModule
  ]
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      identityNumber: ['', [Validators.required, Validators.minLength(13), Validators.pattern(/^\d+$/)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
      birthDate: ['', Validators.required]
    });
  }

  get fullName() { return this.registerForm.get('fullName')!; }
  get lastName() { return this.registerForm.get('lastName')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get identityNumber() { return this.registerForm.get('identityNumber')!; }
  get phoneNumber() { return this.registerForm.get('phoneNumber')!; }
  get birthDate() { return this.registerForm.get('birthDate')!; }

  onSubmit() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      console.log('User Registered:', user);
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
