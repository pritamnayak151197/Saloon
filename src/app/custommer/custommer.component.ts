import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custommer',
  templateUrl: './custommer.component.html',
  styleUrls: ['./custommer.component.css']
})
export class CustommerComponent implements OnInit {

  constructor(private router: Router,) { }

  previousScrollPosition: number = 0;
  selectedCardId: number | null = null;
  isSidebarVisible: boolean = false;
  data: any;

  openSidebar() {
    this.isSidebarVisible = true;
  }

  closeSidebar(){
    this.isSidebarVisible = false;
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
  getUserData(){
    this.data = localStorage.getItem('userData');
    return this.data ? JSON.parse(this.data) : null;
  }
  
  ngOnInit(): void {
    this.data = this.getUserData()
  }

  logOut(){
    localStorage.removeItem('userData');
    this.router.navigate(['/Custommer-Login']);
  }

}
