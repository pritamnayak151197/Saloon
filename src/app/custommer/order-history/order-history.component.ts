import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistory: any

  lastScrollTop = 0;
  bottomBarVisible = true;

  constructor(private location: Location,
    private _apiService : ApiService
  ) { }

  ngOnInit(): void {
    const custommerId = this.loadData()
    this._apiService.getOrderHistoryByCustommerId(custommerId.customerId).subscribe((res) =>{
      this.orderHistory = res
    })
  }


  data : any;
  loadData(){
    this.data = localStorage.getItem('userData');
    return this.data ? JSON.parse(this.data) : null;
  }
  goBack(): void {
    this.location.back();
  }

}
