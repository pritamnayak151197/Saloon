import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) { }
  sidebarVisible: boolean = false;
  selectedItem=  "item2";
  isAdmin: any;
  isSuperAdmin: any;

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
  }

  logout() {
    this.router.navigate(['Login']);
  }
}
