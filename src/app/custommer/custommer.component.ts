import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custommer',
  templateUrl: './custommer.component.html',
  styleUrls: ['./custommer.component.css']
})
export class CustommerComponent implements OnInit {
  subscription: Subscription = new Subscription;
  constructor(private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService
  ) { }

  previousScrollPosition: number = 0;
  selectedCardId: number | null = null;
  isSidebarVisible: boolean = false;
  data: any;
  cartCount: number = 0;
  salondata: any;

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
    this.data = this.getUserData();
    this.salondata = localStorage.getItem('saloonData')
    this.apiService.getDetailsByPrefix(this.data.prefix).subscribe((res: any)=>{
      this.getItemCount(res.salonId)
      this.subscription = this.sharedService.buttonClicked$.subscribe(() => {
        this.getItemCount(res.salonId);
      });
    })
    
  }
  getItemCount(salonId: any){
    this.apiService.getItemCount(this.data.customerId, salonId).subscribe((res: any)=>{
      this.cartCount = res.totalCount;
    })
  }

  logOut(){
    localStorage.removeItem('userData');
    this.router.navigate(['/Custommer-Login']);
  }

}
