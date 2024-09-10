import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-custommer-service',
  templateUrl: './custommer-service.component.html',
  styleUrls: ['./custommer-service.component.css']
})
export class CustommerServiceComponent implements OnInit {

  constructor(private _apiServices: ApiService,
    private cartService: CartService,
    private router: Router) { }
  serviceList: any;
  loadingStates = new Map<number, boolean>();

  ngOnInit(): void {
    this._apiServices.getServiceBySaloonId(1).subscribe((res)=>{
      this.serviceList = res;
    })
  }

  data : any;
  loadData(){
    this.data = localStorage.getItem('userData');
    return this.data ? JSON.parse(this.data) : null;
  }

  finalObject : any;
  addToCart(serviceId: any){
    this.setLoadingState(serviceId, true);
    // Simulate an API call
    setTimeout(() => {
      // Your actual API call logic here
      this.setLoadingState(serviceId, false);
    }, 400); // Simulate a 2-second delay
    const cardObject = {
      [serviceId]: 1
    };
    this.finalObject = this.createFinalObject(cardObject);
    

    this._apiServices.addToCart(this.finalObject).subscribe((res) =>{
      // this.router.navigate(['custommer/add-to-cart']);
      this.cartService.updateCartCount();
    })
  }

  private setLoadingState(serviceId: number, isLoading: boolean) {
    this.loadingStates.set(serviceId, isLoading);
  }

  isLoading(serviceId: number): boolean {
    return this.loadingStates.get(serviceId) ?? false;
  }


  createFinalObject(services: any) {
    const custommerid = this.loadData();
    return {
      customerId: custommerid.customerId,
      salonId: 1,
      packageIds: null,
      serviceIds: services
    };
  }

}
