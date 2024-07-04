import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  constructor(private dialogService: DialogService,
      private _apiService: ApiService,
      private router: Router,
      private messageService: MessageService,
      private authService: AuthService,
      private notificationService: NotificationService
  ) { }

  Username: any;
  visible: boolean = false;
  username: string = '';
  display: boolean = false;
  email: string = '';
  otp: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  recievedOtp: string ='';
  data: string = '';
  loginWithEmail = false;
  logIn = {
    "username":"",
    "phone":"",
    "password":""
  }

  logInWithOtp = {
    "phoneNumber":"",
    "prefix":"krati"
  }
  validateOtp = {
    "phoneNumber": "",
    "prefix":"",
    "otp": ""
}

  ngOnInit(): void {
  }
  logMeinWithEmail(){

    if(this.username.includes('@')){
      this.logIn.username = this.username;
    }
    else{
      this.logIn.phone = this.username;
    }
    this._apiService.login(this.logIn).subscribe((res: any)=>{
      localStorage.setItem('userData', JSON.stringify(res.Data));
      if (res.Data.userType === 'admin') {
        this._apiService.fetchNotifications(res.Data.salonId).subscribe((res)=>{
          let notifictions = res;
          this.notificationService.setNotifications(notifictions);
          console.log(notifictions);
        })
        this.router.navigate(['/Layout/Services']); // Redirect admin to Services component
      } else if (res.Data.userType === 'superadmin') {
        this.router.navigate(['/Layout/Saloons']); // Redirect superadmin to Saloons component
      }
    });
  }

  logMein(){
    this._apiService.logInWithOtp(this.logInWithOtp).subscribe((res: any)=>{
      this.otp = res.success.message;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP sent successfully!' });
    }, (error)=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
    });
    this.otpSent = true;
  }

  loginWithEmailPass(){
    this.loginWithEmail = true;
  }
  verifyOtp(){
    this.validateOtp.otp = this.recievedOtp;
    this.validateOtp.phoneNumber = this.logInWithOtp.phoneNumber;
    this.validateOtp.prefix = 'krati';
    this._apiService.validateOtp(this.validateOtp).subscribe((res: any)=>{
      this.data = res;
      localStorage.setItem('userData', JSON.stringify(res.Data));

      if (res.Data.userType === 'admin') {
        this._apiService.fetchNotifications(res.Data.salonId).subscribe((res)=>{
          let notifictions = res;
          this.notificationService.setNotifications(notifictions);
          console.log(notifictions);
        })
        this.router.navigate(['/Layout/Services']); // Redirect admin to Services component
      } else if (res.Data.userType === 'superadmin') {
        this.router.navigate(['/Layout/Saloons']); // Redirect superadmin to Saloons component
      }
      
    });
    
  }


  submitEmail() {
    if (this.email) {
      // Simulate sending OTP to the email
      console.log('OTP sent to email:', this.email);
      this.otpSent = true;
    }
  }

  submitOTP() {
    if (this.otp) {
      // Simulate OTP verification
      console.log('OTP entered:', this.otp);
      this.otpSent = false;
      this.otpVerified = true;
    }
  }

  resetPassword() {
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      // Handle password reset logic here
      console.log('New password set:', this.newPassword);
      this.display = false;
    } else {
      // Handle password mismatch
      console.log('Passwords do not match');
    }
  }
  

}
