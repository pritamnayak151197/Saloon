import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
      private messageService: MessageService
  ) { }

  Username: any;
  visible: boolean = false;
  username: string = '';
  logIn = {
    "username":"",
    "phone":"",
    "password":""
  }

  ngOnInit(): void {
  }
  logMein(){
    //check if the username is an email or a phone number
    if(this.username.includes('@')){
      this.logIn.username = this.username;
    }
    else{
      this.logIn.phone = this.username;
    }
    this._apiService.login(this.logIn).subscribe((res: any)=>{
      if(res.success){
        localStorage.setItem('adminData', res.data);
        this.router.navigate(['Layout/Saloons']);
        this.messageService.add({ severity: 'success', detail: res.success.message });
      }
    }, (error)=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
    });
  }

  

}
