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
  data: any;
  data2: any;
  prefix = localStorage.getItem('prefix');
  uploadedfile: any;
  url: any;
  salonId: any;
  isVisible = false;
  message = '';
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
  dates: number[] = [];

  show(message: string, duration: number = 3000) {
    this.message = message;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
    }, duration);
  }

  constructor(private fb: FormBuilder,
    private ApiService: ApiService
  ) {
    this.userForm = this.fb.group({
      customerId: [],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      startDate: [''],
      birthDate: ['', [Validators.required]],
      birthMonth: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      type: ['silver', [Validators.required]],
      prefix: [this.prefix, [Validators.required]],
      salonId: [this.salonId],
      customerProfilePic: ['']
    });
  }

  formatDateArray = (dateArray: number[]) => {
    const [year, month, day] = dateArray;
    return `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`;
  };

  ngOnInit(): void {
    // Any initialization logic
    this.dates = Array.from({ length: 31 }, (_, i) => i + 1);
    this.data = this.loadData();
    this.ApiService.getDetailsByPrefix(this.prefix).subscribe((res: any)=>{
      this.salonId = res.salonId;
    })

    this.ApiService.getUserByPhone(this.data.phone, this.prefix).subscribe((res) => {
      this.data2 = res;
      if (this.data2) {
        this.userForm.patchValue({
          name: this.data2.name,
          phone: this.data2.phone,
          email: this.data2.email,
          gender: this.data2.gender,
          locality: this.data2.locality,
          startDate: this.data2.startDate,
          birthMonth: this.data2.birthMonth,
          birthDate: this.data2.birthDate,
          customerProfilePic: this.data2.customerProfilePic
        });
        this.profilePicUrl = this.data2.customerProfilePic
      }
    })
  }

  refresh(){
    this.ApiService.getUserByPhone(this.data.phone, this.prefix).subscribe((res) => {
      this.data2 = res;
      if (this.data2) {
        this.userForm.patchValue({
          name: this.data2.name,
          phone: this.data2.phone,
          email: this.data2.email,
          gender: this.data2.gender,
          locality: this.data2.locality,
          startDate: this.data2.startDate,
          birthMonth: this.data2.birthMonth,
          birthDate: this.data2.birthDate,
          customerProfilePic: this.data2.customerProfilePic
        });
        this.profilePicUrl = this.data2.customerProfilePic
      }
    })
  }

  loadData() {
    this.data = localStorage.getItem('userData');
    return this.data ? JSON.parse(this.data) : null;
  }

  onFileSelected(event: any): void {
    this.uploadedfile = event.target.files[0];
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

  updateUser() {
    if (!this.uploadedfile) {
        this.userForm.patchValue({
          salonId: this.salonId,
          customerId: this.data.customerId,
          startDate: this.data2.startDate
        });
        this.ApiService.updateCustommer(this.userForm.value).subscribe((res) => {
          this.show("user Updated")
        })
    }
    else{

        this.ApiService.uploadImage(this.uploadedfile).subscribe((res: any) => {
          this.url = res;
          // this.ApiService.changeProfilePic(this.data.customerId, this.url[0].url).subscribe((res) => {

          // })
          this.userForm.patchValue({
            customerId: this.data.customerId,
            salonId: this.salonId,
            customerProfilePic: this.url[0].url,
            startDate: this.data2.startDate
          });
          this.ApiService.updateCustommer(this.userForm.value).subscribe((res) => {
            this.refresh();
          })
        })
        
      
    }



  }
}
