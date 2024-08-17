import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-login',
  templateUrl: './custommer-login.component.html',
  styleUrls: ['./custommer-login.component.css'],
  providers: [MessageService]
})
export class CustommerLoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private ApiService : ApiService
  ) {

    
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      startDate: [''],
      birthDate: ['', [Validators.required]],
      birthMonth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      type: ['Silver', [Validators.required]],
      prefix: ['krati', Validators.required],
      locality: ['', [Validators.required]],
      salonId: [2, Validators.required]
    });
   }

  userForm!: FormGroup;
  display =  false;
  userData: any;
  currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  ngOnInit(): void {
  }

  onSubmit(): void {

    this.userForm.patchValue({
      prefix: 'krati',
      salonId: 1,
      startDate: this.currentDate
    });
    if (this.userForm.valid) {
      this.ApiService.addCustommer(this.userForm.value).subscribe((res) => {
        this.router.navigate(['/Custommer-Login']);
      })
    } else {
      console.log('Form is invalid');
    }
  }

  createCustommerAccount(){
    this.display = true;
  }


  logIn(num : any){
    this.ApiService.custommerLogin(num).subscribe((res) =>{
      this.userData = res;
      localStorage.setItem('userData', JSON.stringify(this.userData));
      this.router.navigate(['/custommer/c-Services']);
    })
    
  }

}
  


