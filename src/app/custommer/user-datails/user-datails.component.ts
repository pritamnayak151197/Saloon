import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-user-datails',
  templateUrl: './user-datails.component.html',
  styleUrls: ['./user-datails.component.css']
})
export class UserDatailsComponent implements OnInit {
  userForm: FormGroup;
  previousScrollPosition: number = 0;
  profilePicUrl: any;
  data:any;
  data2: any;

  constructor(private fb: FormBuilder,
    private ApiService :  ApiService
  ) {
    this.userForm = this.fb.group({
      customerId: [],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      startDate: [{ value: '', disabled: true }],
      birthDate: ['', [Validators.required]],
      birthMonth: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      type: ['silver', [Validators.required]],
      prefix: ['krati', [Validators.required]],
      salonId: [1]
    });
  }

  formatDateArray = (dateArray: number[]) => {
    const [year, month, day] = dateArray;
    return `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`;
  };

  ngOnInit(): void {
    // Any initialization logic
    this.data = this.loadData();

    this.ApiService.getUserByPhone(this.data.phone).subscribe((res)=>{
      this.data2 = res;
      if (this.data2) {
        this.userForm.patchValue({
          name: this.data2.name,
          phone: this.data2.phone,
          email: this.data2.email,
          gender: this.data2.gender,
          locality: this.data2.locality,
          startDate: this.formatDateArray(this.data2.startDate),
          birthMonth: this.data2.birthMonth,
          birthDate: this.data2.birthDate
        });
      }
    })

    
  }


  loadData(){
    this.data = localStorage.getItem('userData');
    return this.data ? JSON.parse(this.data) : null;
  }

  onSubmit(): void {
    
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const currentScrollPosition = window.pageYOffset;
    const bottomBar = document.getElementById('bottomBar');

    if (bottomBar) {
      if (currentScrollPosition > this.previousScrollPosition) {
        // Scrolling down
        bottomBar.classList.add('hidden');
      } else {
        // Scrolling up
        bottomBar.classList.remove('hidden');
      }
    }

    this.previousScrollPosition = currentScrollPosition;
  }

  updateUser(){
    if (this.userForm.valid) {
      this.userForm.patchValue({
        customerId: this.data.customerId,
        salonId: 1
      });
      this.ApiService.updateCustommer(this.userForm.value).subscribe((res)=> {

      })
    } else {
      console.log('Form is invalid');
    }


   
  }
}
