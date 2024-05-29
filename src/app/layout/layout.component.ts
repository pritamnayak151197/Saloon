import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private messageService: MessageService,
    private router: Router
  ) { }
  sidebarVisible: boolean = false;
  selectedItem=  "item2";

  selectItem(item: string) {
    this.selectedItem = item;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnInit(): void {
    this.messageService.add({ severity: 'success', detail: 'res.success.message' });
  }

  logout() {
    this.router.navigate(['Login']);
  }
}
