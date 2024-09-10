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
      prefix: [this.prefix, Validators.required],
      locality: ['', [Validators.required]],
      salonId: [this.salonId, Validators.required]
    });
   }

  userForm!: FormGroup;
  display =  false;
  userData: any;
  currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  prefix: string | null = null;
  salonId = 1;

  ngOnInit(): void {
    const hostname = window.location.hostname;
    this.prefix = this.getSubdomain(hostname);
    this.ApiService.getDetailsByPrefix(this.prefix).subscribe((res: any) =>{
      this.salonId = res.salonId;
    })
  }

  getSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts[0]; // Return the first part of the hostname as the subdomain
    }
    return null; // No subdomain present
  }

  onSubmit(): void {

    this.userForm.patchValue({
      prefix: this.prefix,
      salonId: this.salonId,
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
    
    this.ApiService.custommerLogin(num, '').subscribe((res) =>{
      this.userData = res;
      localStorage.setItem('userData', JSON.stringify(this.userData));
      this.router.navigate(['/custommer/c-Services']);
    })
    
  }

}
  


