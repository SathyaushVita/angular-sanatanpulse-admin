import { CommonModule } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdminpageService } from '../adminpage.service';
import { FormControl, NonNullableFormBuilder, } from '@angular/forms';
import { FormBuilder, Validators,FormGroup ,FormArray} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {Injectable} from '@angular/core';
import { MatDialogRef  } from '@angular/material/dialog';

import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NzFormModule,NzInputModule,NzButtonModule,MatDialogModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  displayName: string = 'register';
  registrationForm: any;
  otpForm: any;
  error = '';
  loginForm: any;
  errorMessage: any;
  registeredUsername: string = ''; 
  countdown: number=0;
  isDisabled = false;
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private newsservice: AdminpageService,
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private fb: NonNullableFormBuilder,private authService: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
   )     {

    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
    });

    this.otpForm = this.fb.group({
      verification_otp: ['', Validators.required],
    });

  }

  ngOnInit(): void {}

  // onRegister(): void {

  //   if (this.registrationForm.valid) {
  //     const registerData = this.registrationForm.value;
  //     this.newsservice.Register(registerData).subscribe(
  //       response => {
  //         console.log('Registration successful', response);
  //         this.registeredUsername = registerData.username;
  //         this.displayName = 'otp';
  //       },
  //       error => {
  //         console.error('Error during registration', error);
  //         this.errorMessage = error.error?.message || 'provide the correct username ';

  //       }
  //     );
      
  //   }
    
  // }

  onRegister(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched(); 
      return;
    }
  
    const registerData = this.registrationForm.value;
    this.newsservice.Register(registerData).subscribe(
      response => {
        console.log('Registration successful', response);
        this.registeredUsername = registerData.username;
        this.displayName = 'otp';
      },
      error => {
        console.error('Error during registration', error);
        this.errorMessage = error.error?.message || 'Provide the correct username.';
      }
    );
  }
  

  onVerifyOtp(): void {
    if (this.otpForm.valid) {
      const otpData = {
        username: this.registeredUsername,
        verification_otp: this.otpForm.get('verification_otp')?.value,
      };
      this.newsservice.VerifyOtp(otpData).subscribe(
        response => {
          console.log('OTP verification successful', response);
          this.authService.login(response.access); 
          this.authService.setUserId(response.user_id)
          // this.router.navigate(['/staging']);
          this.dialogRef.close('success')
          
        },
        error => {
          console.error('Error during OTP verification', error);
          this.errorMessage = error.error?.message || 'Enter the correct OTP ';

        }
      );
    }
  }

  showLogin(): void {
    this.displayName = 'login';
  }

  logout(): void {
    this.authService.logout();
  }



  resendOtp(): void {
    const data = {
      username: this.registeredUsername
    };
    this.newsservice.ResendOtp(data).subscribe(
      response => {
        console.log('OTP resent successfully', response);
      },
      error => {
        console.error('Error resending OTP', error);
        this.errorMessage = error.error?.message || 'Error resending OTP. Please try again.';
      }
    );
  }
  



}
