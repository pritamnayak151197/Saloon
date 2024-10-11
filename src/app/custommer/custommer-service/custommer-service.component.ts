import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-custommer-service',
  templateUrl: './custommer-service.component.html',
  styleUrls: ['./custommer-service.component.css']
})
export class CustommerServiceComponent implements OnInit {

  constructor(private _apiServices: ApiService,
    private sharedService: SharedService,
    private router: Router) { }
  serviceList: any;
  loadingStates = new Map<number, boolean>();
  salonId: any;
  isLoading2 = false;
  noServiceAvailable = false;
  filteredServices: any;

  ngOnInit(): void {
    this.isLoading2 = true;
    const prefix =  localStorage.getItem('prefix');
    this._apiServices.getDetailsByPrefix(prefix).subscribe((res: any) =>{
      this.salonId = res.salonId;
      this._apiServices.getServiceBySaloonId(this.salonId).subscribe(
        (res) => {
          this.serviceList = res;
          this.filteredServices = res.filter((service: { status: boolean; }) => service.status === true);
          this.isLoading2 = false;  // Stop loading when data is received
          if(this.filteredServices == "No services Found!"){
            this.noServiceAvailable = true;
          }
        },
        (error) => {
          console.error('Error fetching service list:', error);  // Log the error for debugging
          this.isLoading2 = false;  // Stop loading on error as well
          this.noServiceAvailable = true;
        }
      );
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
      this.sharedService.triggerButtonClick();
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
      salonId: this.salonId,
      packageIds: null,
      serviceIds: services
    };
  }

  getServiceTypeClass(serviceType: string): string {
    // Normalize the service type to lowercase for consistent comparison
    const normalizedType = serviceType.toLowerCase();
    
    // Return the appropriate class based on service type
    switch (normalizedType) {
      case 'male':
        return 'badge-male';    // Returns the class for Male services
      case 'female':
        return 'badge-female';  // Returns the class for Female services
      default:
        return 'badge-other';   // Returns the class for Other services
    }
  }
  
}
