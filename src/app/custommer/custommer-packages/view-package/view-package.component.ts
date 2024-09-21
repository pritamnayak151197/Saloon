import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-package',
  templateUrl: './view-package.component.html',
  styleUrls: ['./view-package.component.css']
})
export class ViewPackageComponent implements OnInit {

  param: {
    customerId: number;
    salonId: number;
    packageIds: number[];
    serviceIds: number[];
  } = {
    customerId: 2,
    salonId: 1,
    packageIds: [],
    serviceIds: []
  };

  constructor(private route: ActivatedRoute,
    private  _apiService: ApiService,
    private router: Router,
  ) { }

  packageId: any;
  product : any;
  data: any;
  serviceIds: any;
  serviceDetails: any;

  ngOnInit(): void {
    this.packageId = this.route.snapshot.paramMap.get('id');

    this._apiService.getPackageById(this.packageId).subscribe((res) => {
      this.product = res
      this.serviceIds = this.product.services
      const requests = this.serviceIds.map((id: any) => this._apiService.getServicesById(id));

    // Use forkJoin to run all the requests in parallel
    forkJoin(requests).subscribe(
      (responses: any) => {
        // Store all the responses
        this.serviceDetails = responses;
        console.log(this.serviceDetails);
        console.log('All service details:', this.serviceDetails);
      },
      error => {
        console.error('Error fetching service details', error);
      }
    );
    })
  }


  loadData(){
    this.data = localStorage.getItem('userData');
    return this.data ? JSON.parse(this.data) : null;
  }

  finalObject : any;
  addToCart(packageId: any){
    const cardObject = {
      [packageId]: 1
    };
    this.finalObject = this.createFinalObject(cardObject);
    

    this._apiService.addToCart(this.finalObject).subscribe((res) =>{
      // this.router.navigate(['custommer/add-to-cart']);
    })
  }


  createFinalObject(packages: any) {
    const custommerid = this.loadData();
    return {
      customerId: custommerid.customerId,
      salonId: 1,
      packageIds: packages,
      serviceIds: null
    };
  }
  

}
