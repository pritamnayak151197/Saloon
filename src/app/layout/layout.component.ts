import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }
  sidebarVisible: boolean = false;
  selectedItem=  "item2";
  isAdmin: any;
  isSuperAdmin: any;
  notifications: any;
  unreadCount: any;
  userData: any;
  notificationCount = 0;
  dropdownVisible = false;
  saloonData:any;
  adminSalonData:any;
  editSaloonData = false;
  salonForm: any;
  responseDataSubmit: any;
  saloonLogo: any
  qrCode: any;
  selectedFile: any;
  selectedFile2: any;

  selectItem(item: string) {
    this.selectedItem = item;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.apiService.uploadImage(this.selectedFile).subscribe((res: any) =>{
      this.saloonLogo = res;
    })
  }

  onFileSelected2(event: any): void {
    this.selectedFile2 = event.target.files[0];

    this.apiService.uploadImage(this.selectedFile2).subscribe((res: any) =>{
      this.qrCode = res;
    })
  }

  onEdit(){
    let saloonId = this.getUserData();
    if (!this.selectedFile && !this.selectedFile2) {    
    this.salonForm.value['salonId'] = saloonId.salonId;
    this.salonForm.value['qrCode'] = this.qrCode;
    this.salonForm.value['salonLogo'] = this.saloonLogo;
    this.apiService.updateSaloonById(this.salonForm.value).subscribe((data) =>{
      this.responseDataSubmit = data;
      this.editSaloonData = false;
      window.location.reload();
    });
  }
  else{
    if (!this.selectedFile && this.selectedFile2) {    
      this.salonForm.value['salonLogo'] = this.saloonLogo;
      this.salonForm.value['qrCode'] = this.qrCode[0].url;
    }

    else if (this.selectedFile && !this.selectedFile2) {    
      this.salonForm.value['salonLogo'] = this.saloonLogo[0].url;
      this.salonForm.value['qrCode'] = this.qrCode;
    }

    else if(this.saloonLogo && this.selectedFile2){
      this.salonForm.value['salonLogo'] = this.saloonLogo[0].url;
      this.salonForm.value['qrCode'] = this.qrCode[0].url;
    }
    
    this.salonForm.value['salonId'] = saloonId.salonId;
    this.salonForm.value['services'] = this.selectedFile;
    this.apiService.updateSaloonById(this.salonForm.value).subscribe((data) =>{
      this.responseDataSubmit = data;
      this.editSaloonData = false;
      window.location.reload();
    }, err =>{
      alert(err.error.message)
    });
  }
  }

  getUserData(): any {
    this.userData = localStorage.getItem('userData');
    return JSON.parse(this.userData);
  }


  editSaloon(){
    console.log(this.adminSalonData);
    this.editSaloonData = true;
    this.populateForm(this.adminSalonData);
  }

  populateForm(data: any) {
    this.salonForm.patchValue({
      salonName: data.salonName,
      phone: data.phone,
      address: data.address,
      addressUrl: data.addressUrl,
      salonLogo: data.salonLogo,
      qrCode: data.qrCode,
      registeredOn: this.formatDate(data.registeredOn),
      subscriptionStartDate: this.formatDate(data.subscriptionStartDate),
      subscriptionEndDate: this.formatDate(data.subscriptionEndDate),
      status: data.status,
      sms: data.sms,
      coupon: data.coupon,
      membership: data.membership
    });

    this.saloonLogo = data.salonLogo;
    this.qrCode = data.qrCode;
  }

  formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  saloonData2: any;
  saloonName: any;
  getSalonData(): any {
    this.saloonData2 = localStorage.getItem('saloonData');
    return JSON.parse(this.saloonData2);
  }

  isInvalid(controlName: string): boolean {
    const control = this.salonForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }


  ngOnInit(): void {
    this.messageService.add({ severity: 'success', detail: 'res.success.message' });
    this.isAdmin = this.authService.isAdmin();
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.saloonName = this.getSalonData();

    let saloonId = this.getUserData();
    if (this.isAdmin) {
      this.apiService.fetchNotifications(saloonId.salonId).subscribe((data) => {
        this.notifications = data;
        this.unreadCount = data.length;
        // this.unreadCount = this.notifications.filter(notification => !notification.read).length;
      });
      // this.notificationService.getNotifications().subscribe((res) => {
      //   this.notifications = res;
      //   this.unreadCount = res.length;
      // });
      this.apiService.getServiceBySaloonId(saloonId.salonId).subscribe((data) => {
        this.saloonData = data;
      });

      this.apiService.getSaloonListById(saloonId.salonId).subscribe((data) => {
        this.adminSalonData = data;
        this.saloonLogo = this.adminSalonData.salonLogo;
        this.qrCode = this.adminSalonData.qrCode;
      });
    }

    this.salonForm = this.fb.group({
      salonName: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', Validators.required],
      addressUrl: ['', Validators.required],
      salonLogo: ['', Validators.required],
      registeredOn: ['', Validators.required],
      subscriptionStartDate: ['', Validators.required],
      subscriptionEndDate: ['', Validators.required],
      status: [false, ],
      qrCode: ['', Validators.required],
      sms: [false, ],
      coupon: [false, ],
      membership: [false, ]
    });
  }


  toggleDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.dropdownVisible = !this.dropdownVisible;
    this.markAsRead()
  }

  markAsRead(): void {
    let saloonId = this.getUserData();

    // this.unreadCount = this.notifications.filter(n => !n.read).length;
    this.apiService.marlAllRead(saloonId.salonId).subscribe(()=> {

    })
  }

  logout() {

  // Navigate to the login page
  this.router.navigate(['Login']);
}
}
