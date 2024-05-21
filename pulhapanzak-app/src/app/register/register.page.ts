import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  IonDatetime 
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
    IonDatetime, 
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class RegisterPage {
  @ViewChild('datePicker', { static: false }) datePicker!: IonDatetime;
  
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

  openDatePicker() {
    this.datePicker.open();
  }

  onDateChange(event: any) {
    this.registerForm.patchValue({ birthDate: event.detail.value });
    this.datePicker.close();
  }
}
