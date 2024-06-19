import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  constructor(private _apiService: ApiService,
    private fb: FormBuilder,
    private _exportToExcelService: ExportToExcelService,
  ) { }
  totalCount: any;
  serviceslist:any = [];
  saloonData: any;
  selectedCardId = 1;
  visible = false;
  salonForm: any;
  responseDataSubmit: any;
  packageForm : any;
  userData: any;
  serviceData: any;
  dropdownSettings = {};

  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.serviceslist, 'package_list');
  }

  onSubmit(){
    if (this.salonForm.valid) {
      console.log(this.salonForm.value);
      this._apiService.addSaloon(this.salonForm.value).subscribe((data) =>{
        this.responseDataSubmit = data;
      });
    }
  }


  handleCardClick(details:any){
      // this.saloonData = this.saloonList.find(salon => salon.salonId === details);
      // this.selectedCardId = details;
  }

  addSaloon(){
    this.visible = true;
  }

  isInvalid(controlName: string): boolean {
    const control = this.salonForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }


  getUserData(): any {
    this.userData = localStorage.getItem('userData');
    return JSON.parse(this.userData);
  }
  onCheckboxChange(e: any) {
    const selectedServices: number[] = this.packageForm.get('services').value as number[];

    if (e.target.checked) {
      selectedServices.push(parseInt(e.target.value, 10));
    } else {
      const index = selectedServices.indexOf(parseInt(e.target.value, 10));
      if (index > -1) {
        selectedServices.splice(index, 1);
      }
    }

    this.packageForm.patchValue({ services: selectedServices });
  }


  ngOnInit(): void {
    let saloonId = this.getUserData();
    this._apiService.getServiceBySaloonId(saloonId.salonId).subscribe((res: any) =>{
      this.serviceData = res;
    });
    this.packageForm = this.fb.group({
      packageName: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      discountPrice: [null, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: [false, Validators.required],
      services: [[], Validators.required],
      salonId: [null, Validators.required]
    });
   
    this._apiService.getPackagesBySaloonId(saloonId.salonId).subscribe((res: any) =>{
      this.serviceslist = res
      this.totalCount = res.length;
      console.log(this.serviceslist);
      // this.saloonData = this.serviceslist.find(salon => salon.salonId === 1);
    });  

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

}
