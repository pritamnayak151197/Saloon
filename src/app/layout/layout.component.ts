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

  selectItem(item: string) {
    this.selectedItem = item;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onEdit(){
    this.salonForm.value['salonId'] = this.adminSalonData.salonId;
    this.apiService.updateSaloonById(this.salonForm.value).subscribe((data) =>{
      this.responseDataSubmit = data;
      window.location.reload();
      this.editSaloonData = false;
    });
    
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  toggleDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.dropdownVisible = !this.dropdownVisible;
  }

  markAsRead(notification: any): void {
    notification.read = true;
    // this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  logout() {

  // Navigate to the login page
  this.router.navigate(['Login']);
}
}
