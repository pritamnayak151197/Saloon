import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-custommer-packages',
  templateUrl: './custommer-packages.component.html',
  styleUrls: ['./custommer-packages.component.css']
})
export class CustommerPackagesComponent implements OnInit {

  constructor(private _apiServices: ApiService,
    private sharedService: SharedService,
    private router: Router
  ) { }
  packageList: any;
  salonId: any;
  loadingStates = new Map<number, boolean>();
  isLoading2 = false;
  noServiceAvailable = false;
  filteredServices: any;

  ngOnInit(): void {
    this.isLoading2 = true;
    const prefix = localStorage.getItem('prefix');
    this._apiServices.getDetailsByPrefix(prefix).subscribe((res: any) =>{
      this.salonId = res.salonId;
      this._apiServices.getPackagesBySaloonId(this.salonId).subscribe((res:any)=>{
        this.packageList = res;
        this.filteredServices = res.filter((service: { status: boolean; }) => service.status === true);
        this.isLoading2 = false;
        if(this.filteredServices == "No packages available!"){
          this.noServiceAvailable = true;
        }
      })
    })
    
  }

  goToProductDetail(id : any){
    this.router.navigate(['custommer/Package-detail', id]);
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
      this.sharedService.triggerButtonClick();
    })
  }


  createFinalObject(packages: any) {
    const custommerid = this.loadData();
    return {
      customerId: custommerid.customerId,
      salonId: this.salonId,
      packageIds: packages,
      serviceIds: null
    };
  }
  private setLoadingState(serviceId: number, isLoading: boolean) {
    this.loadingStates.set(serviceId, isLoading);
  }

  isLoading(serviceId: number): boolean {
    return this.loadingStates.get(serviceId) ?? false;
  }

}


