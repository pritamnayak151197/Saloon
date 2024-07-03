import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }
  sidebarVisible: boolean = false;
  selectedItem=  "item2";
  isAdmin: any;
  isSuperAdmin: any;
  notifications: any;
  unreadCount: any;

  selectItem(item: string) {
    this.selectedItem = item;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnInit(): void {
    this.messageService.add({ severity: 'success', detail: 'res.success.message' });
    this.isAdmin = this.authService.isAdmin();
    this.isSuperAdmin = this.authService.isSuperAdmin();

    if (this.isAdmin) {
      this.notificationService.getNotifications().subscribe((data) => {
        this.notifications = data;
        // this.unreadCount = this.notifications.filter(notification => !notification.read).length;
      });
    }
  }

  logout() {
    this.router.navigate(['Login']);
  }
}
