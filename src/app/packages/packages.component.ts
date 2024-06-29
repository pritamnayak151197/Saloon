import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  constructor(private _apiService: ApiService,
    private fb: FormBuilder,
    private _exportToExcelService: ExportToExcelService,
    private route: ActivatedRoute
  ) { }
  totalCount: any;
  serviceslist: any = [];
  saloonData: any;
  selectedCardId = 1;
  visible = false;
  salonForm: any;
  responseDataSubmit: any;
  packageForm: any;
  userData: any;
  serviceData: any;
  dropdownSettings = {};
  selectedOptions: string[] = [];
  packageIdforEdit: any;
  editPackageForm: any;
  editVisible: any;
  salons: any;
  isSuperAdmin = false;
  selectedSaloon: any;
  selectedId: any;

  onOptionChange(event: any, value: string) {
    if (event.target.checked) {
      this.selectedOptions.push(value);
    } else {
      const index = this.selectedOptions.indexOf(value);
      if (index >= 0) {
        this.selectedOptions.splice(index, 1);
      }
    }
  }

  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.serviceslist, 'package_list');
  }


  onSubmit() {
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.packageForm.value.salonId = userdata.salonId;
    }
    else {
      this.packageForm.value.salonId = +this.selectedId;
    }
    const formValues = this.packageForm.value;
    // Format the date
    formValues.startDate = this.formatDate(formValues.startDate);
    formValues.endDate = this.formatDate(formValues.endDate);

    this.packageForm.value.services = this.selectedOptions;
    this._apiService.addPackages(this.packageForm.value).subscribe((data) => {
      this.visible = false;
      this.serviceslist.unshift(data);
    });
  }
  onEdit() {
    const formValues = this.packageForm.value;
    // Format the date
    formValues.startDate = this.formatDate(formValues.startDate);
    formValues.endDate = this.formatDate(formValues.endDate);
    if (!this.packageForm.value.services) {
      this.packageForm.value.services = this.editPackageForm.services;
    }
    else {

    }
    this.packageForm.value.packageLogo = '';
    this.packageForm.value.salonLogo = '';
    this.packageForm.value.packageId = this.editPackageForm.packageId;
    this._apiService.updatePackageById(this.packageForm.value).subscribe((res) => {

      this.editVisible = false
      this.loadData(null);
    });
    this.visible = false
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }


  handleCardClick(details: any) {
    this.packageIdforEdit = details;
    this.editPackageForm = this.serviceslist.find((service: any) => service.packageId === details);
    this.editVisible = true;
    this.openEditDialog(this.editPackageForm)
  }

  openEditDialog(data: any) {
    this.editVisible = true;
    this.populateForm(data); // Assuming data contains existing service details
  }

  populateForm(data: any) {
    this.packageForm.patchValue({
      packageName: data.packageName,
      price: data.price,
      discountPrice: data.discountPrice,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      salonId: data.salonId
    });
  }

  clearData() {
    this.packageForm.patchValue({
      packageName: '',
      price: null,
      discountPrice: null,
      startDate: null,
      endDate: null,
      status: null,
      salonId: null
    });
  }
  onEditSubmit() { }

  addSaloon() {
    this.clearData();
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

  loadData(saloonIdIfSuperAdmin: any) {
    let saloonId = this.getUserData();
    this._apiService.getServiceBySaloonId(saloonId.salonId).subscribe((res: any) => {
      this.serviceData = res;
    });
    if (saloonIdIfSuperAdmin == null) {
      this._apiService.getPackagesBySaloonId(saloonId.salonId).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
        // this.saloonData = this.serviceslist.find(salon => salon.salonId === 1);
      });
    }
    else {
      this._apiService.getPackagesBySaloonId(saloonIdIfSuperAdmin).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
        // this.saloonData = this.serviceslist.find(salon => salon.salonId === 1);
      });
    }



  }


  onSalonSelect(event: Event) {
    this.selectedId = (event.target as HTMLSelectElement).value;
    this.selectedSaloon = this.selectedId ? Number(this.selectedId) : null;
    console.log('Selected Salon ID:', this.selectedSaloon);
    this.loadData(this.selectedSaloon);
    this.isSuperAdmin = false;
  }
  salonId: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.salonId = Number(params.get('id'));
    });
    if (!this.salonId) {
      let userdata = this.getUserData();
      if (userdata.userType == "superadmin") {
        this._apiService.getSaloonList().subscribe((res) => {
          this.salons = res;
        });
        this.isSuperAdmin = true;
      }
      else {
        this.loadData(null);
      }
    }
    else{
      this.isSuperAdmin = false;
      this.loadData(this.salonId);
    }


    this.packageForm = this.fb.group({
      packageName: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      discountPrice: [null, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: [false, Validators.required]
    });
  }

}
