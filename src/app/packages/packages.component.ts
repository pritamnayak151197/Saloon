import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon, Package } from '../../assets/saloon.interface';
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
  ) {
  }
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
  filteredServices: Package[] = [];
  searchText: string = '';
  showAddButton = false;
  selectedFile: any
  selectedFileUrl: any;
  message = '';

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

  filterServices() {
    this.filteredServices = this.serviceslist.filter((service: { packageName: string; packageId: { toString: () => string; }; price: string; }) => {
      const searchTerm = this.searchText.toLowerCase();
      return service.packageName.toLowerCase().includes(searchTerm) ||
        service.packageId.toString().toLowerCase().includes(searchTerm) ||
        service.price.toString().toLowerCase().includes(searchTerm)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.serviceslist, 'package_list');
  }


  onSubmit() {
    let salonId = this.getUserData();
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.packageForm.value.salonId = userdata.salonId;
    }
    else {
      this.packageForm.value.salonId = this.selectedSaloon;
    }
    if (this.selectedFile) {
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.packageForm.value.packageLogo = this.selectedFileUrl;
        this.packageForm.value.services = this.selectedOptions;


        this._apiService.addPackages(this.packageForm.value).subscribe((res) => {
          if (res) {
            this.serviceslist.unshift(res);
            if (userdata.userType != "superadmin") {
              this.loadData(userdata.salonId);
            }
            else {
              this.loadData(+this.selectedSaloon);
            }
          }
          else {
            this.filteredServices.length = 0;
            this.message = 'No Data Found'
          }

        });
      });
    }
    else {
      if (true) {
        this._apiService.addPackages(this.packageForm.value).subscribe((res) => {
          this.serviceslist.unshift(res);
          if (userdata.userType != "superadmin") {
            this.loadData(userdata.salonId);
          }
          else {
            this.loadData(+this.selectedSaloon);
          }
        });
      } else {
        console.log('Form is invalid');
      }
    }


    this.visible = false;


  }
  onEdit() {

    let salonId = this.getUserData();
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.packageForm.value.salonId = userdata.salonId;
    }
    else {
      this.packageForm.value.salonId = this.selectedSaloon;
    }
    if (this.selectedFile) {
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.packageForm.value.packageLogo = this.selectedFileUrl;

        const formValues = this.packageForm.value;

        formValues.startDate = this.formatDate(formValues.startDate);
        formValues.endDate = this.formatDate(formValues.endDate);
        this.packageForm.value.services = this.editPackageForm.services;

        this.packageForm.value.packageId = this.editPackageForm.packageId;
        this._apiService.updatePackageById(this.packageForm.value).subscribe((res) => {
  
          this.editVisible = false
          if (userdata.userType != "superadmin") {
            this.loadData(userdata.salonId);
          }
          else {
            this.loadData(+this.selectedSaloon);
          }
        });
        this.visible = false;

      });
    }
    else {
      const formValues = this.packageForm.value;

      formValues.startDate = this.formatDate(formValues.startDate);
      formValues.endDate = this.formatDate(formValues.endDate);
      if (!this.packageForm.value.services) {
        this.packageForm.value.services = this.editPackageForm.services;
      }
      else {

      }
      // this.packageForm.value.packageLogo = '';
      // this.packageForm.value.salonLogo = '';
      this.packageForm.value.packageId = this.editPackageForm.packageId;
      this._apiService.updatePackageById(this.packageForm.value).subscribe((res) => {

        this.editVisible = false
        if (userdata.userType != "superadmin") {
          this.loadData(userdata.salonId);
        }
        else {
          this.loadData(+this.selectedSaloon);
        }
      });
      this.visible = false;
    }



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

  formatDate2 = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };
  imgUrl = ''
  populateForm(data: any) {
    this.packageForm.patchValue({
      packageName: data.packageName,
      price: data.price,
      discountPrice: data.discountPrice,
      startDate: this.formatDate(data.startDate),
      endDate: this.formatDate(data.endDate),
      status: data.status,
      salonId: data.salonId
    });
    this.imgUrl = data.packageLogo;

    const dateStr = this.arrayToDateStr(data.startDate);
    this.packageForm.value.startDate = dateStr
  }

  arrayToDateStr(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    const monthStr = (month + 1).toString().padStart(2, '0'); // Adjust for zero-indexed months
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
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

    this.packageForm.patchValue({
      status: true,
    });
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
    if (saloonIdIfSuperAdmin == null) {
      this._apiService.getPackagesBySaloonId(saloonId.salonId).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
        // this.saloonData = this.serviceslist.find(salon => salon.salonId === 1);
        if (res) {
          this.filteredServices = [...this.serviceslist];
        }
        else {
          this.filteredServices.length = 0
        }
      }, err => {
        this.filteredServices.length = 0
      });
    }
    else {
      this._apiService.getPackagesBySaloonId(saloonIdIfSuperAdmin).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
        // this.saloonData = this.serviceslist.find(salon => salon.salonId === 1);
        if (res) {
          this.filteredServices = [...this.serviceslist];
        }
        else {
          this.filteredServices.length = 0
        }
      }, err => {
        this.filteredServices.length = 0
      });
    }



  }


  onSalonSelect(event: Event) {
    this.selectedId = (event.target as HTMLSelectElement).value;
    this.selectedSaloon = this.selectedId ? Number(this.selectedId) : null;
    console.log('Selected Salon ID:', this.selectedSaloon);
    this.loadData(this.selectedSaloon);
    this.showAddButton = true;
    this._apiService.getServiceBySaloonId(this.selectedSaloon).subscribe((res) => {
      this.serviceData = res;
    })
  }
  salonId: any;
  ngOnInit(): void {

    let userdata = this.getUserData();
    if (userdata.userType == "superadmin") {
      this._apiService.getSaloonList().subscribe((res) => {
        this.salons = res;
      });
      this.isSuperAdmin = true;
    }
    else {
      this.loadData(null);
      this._apiService.getServiceBySaloonId(userdata.salonId).subscribe((res) => {
        this.serviceData = res;
      })
    }



    this.packageForm = this.fb.group({
      packageName: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      discountPrice: [null, [Validators.required, Validators.min(0)]],
      startDate: [null, Validators.required],
      packageLogo: [null, Validators.required],
      endDate: [null, Validators.required],
      status: [true, Validators.required]
    });
  }

}
