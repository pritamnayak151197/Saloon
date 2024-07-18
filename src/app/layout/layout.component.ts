import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';
import { ApiService } from '../api.service';

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

  selectItem(item: string) {
    this.selectedItem = item;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  getUserData(): any {
    this.userData = localStorage.getItem('userData');
    return JSON.parse(this.userData);
  }

  ngOnInit(): void {
    this.messageService.add({ severity: 'success', detail: 'res.success.message' });
    this.isAdmin = this.authService.isAdmin();
    this.isSuperAdmin = this.authService.isSuperAdmin();

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
      });
    }
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
    this.router.navigate(['Login']);
  }
}
