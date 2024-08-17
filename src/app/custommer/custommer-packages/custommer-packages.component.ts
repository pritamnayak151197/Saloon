import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custommer-packages',
  templateUrl: './custommer-packages.component.html',
  styleUrls: ['./custommer-packages.component.css']
})
export class CustommerPackagesComponent implements OnInit {

  constructor(private _apiServices: ApiService,
    private router: Router
  ) { }
  packageList: any;
  
  ngOnInit(): void {
    this._apiServices.getPackagesBySaloonId(1).subscribe((res)=>{
      this.packageList = res;
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
    const cardObject = {
      [serviceId]: 1
    };
    this.finalObject = this.createFinalObject(cardObject);
    

    this._apiServices.addToCart(this.finalObject).subscribe((res) =>{
      this.router.navigate(['custommer/add-to-cart']);
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


