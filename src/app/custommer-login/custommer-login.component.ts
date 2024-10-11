import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


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
    private route: ActivatedRoute,
    private messageService: MessageService,
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
  dates: number[] = [];
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];
  isVisible = false;
  errorVisible = false;
  message = '';

  show(message: string, duration: number = 3000) {
    this.message = message;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
    }, duration);
  }

  ngOnInit(): void {
    this.dates = Array.from({ length: 31 }, (_, i) => i + 1);
    // localStorage.removeItem('prefix');
    if(!this.prefix){
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
    else{
      this.ApiService.getDetailsByPrefix(this.prefix).subscribe((res: any) =>{
        this.salonId = res.salonId;
      })
    }
       
  }

  onSubmit(): void {
    this.userForm.patchValue({
      prefix: this.prefix,
      salonId: this.salonId,
      startDate: this.currentDate
    });

      this.ApiService.addCustommer(this.userForm.value).subscribe((res) => {
        this.display = false;
        this.show("User created Successfully")
      })
  }

  createCustommerAccount(){
    this.display = true;
  }

  clearError() {
    this.message = ''; // Clear the message
    this.isVisible = false; // Hide the error message
  }

  logIn(num : any){
    this.prefix = localStorage.getItem("prefix")
    this.ApiService.custommerLogin(num, this.prefix).pipe(
      catchError((error) => {
        this.isVisible = true;
        this.message = error?.error?.message || 'Login failed. Please try again.';
        setTimeout(() => {
          this.clearError(); // Call method to clear the message
        }, 3000);
        return of(null); // Return a null observable to continue the stream
      })
    ).subscribe((res) => {
      if (res) { // Check if the response is not null
        this.userData = res;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.router.navigate(['/custommer/c-Services']);
      }
    });
    
  }

}
  


