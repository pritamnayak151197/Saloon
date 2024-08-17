import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isVisible: boolean = false;
  @Output() closeSidebar: EventEmitter<void> = new EventEmitter<void>();

  closeSidebar2() {
    this.closeSidebar.emit();
  }
  constructor(private router: Router,){

  }

  logOut(){
    localStorage.removeItem('userData');
    this.router.navigate(['Custommer-Login']);
  }
}
