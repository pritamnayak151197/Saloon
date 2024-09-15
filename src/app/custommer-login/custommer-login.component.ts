import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './custommer-login.component.html',
  styleUrls: ['./custommer-login.component.css'],
  providers: [MessageService]
})
export class CustommerLoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private ApiService : ApiService,
    private route: ActivatedRoute
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
  prefix: any;
  salonId = 1;

  ngOnInit(): void {
    // Subscribe to query params to get the prefix
    this.route.queryParams.subscribe(params => {
      const prefix = params['prefix']; // Retrieve the 'prefix' query param
      this.prefix = prefix;
      console.log(prefix)
      if (prefix) {
        // Store the prefix in localStorage
        localStorage.setItem('prefix', prefix);
        console.log('Prefix stored in localStorage:', prefix);
        this.ApiService.getDetailsByPrefix(prefix).subscribe((res: any) =>{
          this.salonId = res.salonId;
        })
      } else {
        console.log('No prefix found in URL.');
      }
    });    
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
    
    this.ApiService.custommerLogin(num, this.prefix).subscribe((res) =>{
      this.userData = res;
      localStorage.setItem('userData', JSON.stringify(this.userData));
      this.router.navigate(['/custommer/c-Services']);
    })
    
  }

}
  


