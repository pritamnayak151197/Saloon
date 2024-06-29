import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(private _apiService: ApiService,
    private fb: FormBuilder,
    private _exportToExcelService: ExportToExcelService,
    private messageService: MessageService,
    private router: Router
  ) { }
  totalCount: any;
  serviceslist: any = [];
  saloonData: any;
  selectedCardId = 1;
  visible = false;
  salonForm: any;
  responseDataSubmit: any;
  valueOfInput: string = '';
  serviceForm: any;
  userData: any;
  selectedFile: any;
  selectedFileUrl: any;
  editVisible = false;
  editServiceForm: any;
  serviceIdforEdit: any;
  isSuperAdmin = false
  salons: any;
  selectedSaloon: any;


  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.serviceslist, 'service_list');
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data exported successfully!' });
  }

  onUpdate() {
    if (this.selectedFile) {
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.serviceForm.value.servicePic = this.selectedFileUrl;
        let salonId = this.getUserData();
        this.serviceForm.value.salonId = salonId.salonId
        console.log(this.serviceForm)
        if (this.serviceForm.valid) {
          this._apiService.updateServiceById(this.serviceForm.value).subscribe((res) => {
          });
        } else {
          console.log('Form is invalid');
        }
      });
    }

    else {
      this.serviceForm.value.serviceId = this.serviceIdforEdit;
      this.serviceForm.value.servicePic = this.editServiceForm.servicePic;
      this._apiService.updateServiceById(this.serviceForm.value).subscribe((res) => {

        this.editVisible = false
        this.loadData(null);
      });
    }
    this.visible = false
  }

  onSubmit() {
    if (this.selectedFile) {
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.serviceForm.value.servicePic = this.selectedFileUrl;
        let salonId = this.getUserData();
        this.serviceForm.value.salonId = salonId.salonId
        console.log(this.serviceForm)
        if (this.serviceForm.valid) {
          this._apiService.addservice(this.serviceForm.value).subscribe((res) => {
            this.serviceslist.unshift(res);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added successfully!' });
          });
        } else {
          console.log('Form is invalid');
        }
      });
    }
    else{
      if (this.serviceForm.valid) {
        this._apiService.addservice(this.serviceForm.value).subscribe((res)=>{
          this.serviceslist.unshift(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added successfully!' });
        });
      } else {
        console.log('Form is invalid');
      }
    }


    this.visible = false

  }


  handleCardClick(details: any) {
    this.serviceIdforEdit = details;
    this.editServiceForm = this.serviceslist.find((service: any) => service.serviceId === details);
    this.editVisible = true;
    this.openEditDialog(this.editServiceForm)
  }

  openEditDialog(data: any) {
    this.editVisible = true;
    this.populateForm(data); // Assuming data contains existing service details
  }

  addServices() {
    this.clearData();
    this.visible = true;
  }

  isInvalid(controlName: string): boolean {
    const control = this.salonForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  getUserData(): any {
    this.userData = localStorage.getItem('userData');
    return JSON.parse(this.userData);
  }

  populateForm(data: any) {
    this.serviceForm.patchValue({
      serviceName: data.serviceName,
      details: data.details,
      price: data.price,
      discountPrice: data.discountPrice,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      salonId: data.salonId
    });
  }
  clearData() {
    this.serviceForm.patchValue({
      serviceName: null,
      details: null,
      price: null,
      discountPrice: null,
      startDate: null,
      endDate: null,
      status: null,
      salonId: null
    });
  }

  loadData(saloonIdforSuperadmin: any) {
    if (saloonIdforSuperadmin == null) {
      let saloonId = this.getUserData();
      this._apiService.getServiceBySaloonId(saloonId.salonId).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
      });
    }
    else {
      this._apiService.getServiceBySaloonId(saloonIdforSuperadmin).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
      });
    }

  }
  onSalonSelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedSaloon = selectedId ? Number(selectedId) : null;
    console.log('Selected Salon ID:', this.selectedSaloon);
    this.loadData(this.selectedSaloon);
    this.isSuperAdmin = false;
  }

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
    }
    this.serviceForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      details: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      servicePic: [],
      discountPrice: [null, [Validators.required, Validators.min(0)]],
      status: [false, [Validators.required]],
      serviceType: ['', [Validators.required]]
    });
  }
}
