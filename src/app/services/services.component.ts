import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon, Service } from '../../assets/saloon.interface';
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
  ) {

    interface Service {
      serviceId: string;
      serviceName: string;
      price: number;
      details: string;
      discountPrice: number;
      status: string;
      servicePic: string;
    }
   }
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
  filteredServices: Service[] = [];
  searchText: string = '';
  selectedId: any;
  message: any;
 showAddServiceButton = false;


  filterServices() {
    this.filteredServices = this.serviceslist.filter((service: { serviceName: string; serviceId: { toString: () => string; }; details: string; price: string; }) => {
      const searchTerm = this.searchText.toLowerCase();
      return service.serviceName.toLowerCase().includes(searchTerm) ||
             service.serviceId.toString().toLowerCase().includes(searchTerm) ||
             service.details.toLowerCase().includes(searchTerm) ||
             service.price.toString().toLowerCase().includes(searchTerm)
    });
  }

  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.serviceslist, 'service_list');
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data exported successfully!' });
  }

  onUpdate() {
    let salonId = this.getUserData();
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.serviceForm.value.salonId = userdata.salonId;
    }
    else {
      this.serviceForm.value.salonId = this.selectedSaloon;
    }
    if (this.selectedFile) {
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.serviceForm.value.servicePic = this.selectedFileUrl;
        this.serviceForm.value.serviceId = this.serviceIdforEdit;
        let salonId = this.getUserData();
        this.serviceForm.value.salonId = salonId.salonId
        console.log(this.serviceForm)
        if (this.serviceForm.valid) {
          this._apiService.updateServiceById(this.serviceForm.value).subscribe((res) => {
            this.editVisible = false
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
      });
    }

    else {
      this.serviceForm.value.serviceId = this.serviceIdforEdit;
      this.serviceForm.value.servicePic = this.editServiceForm.servicePic;
      this._apiService.updateServiceById(this.serviceForm.value).subscribe((res) => {

        this.editVisible = false
        if (userdata.userType != "superadmin") {
          this.loadData(userdata.salonId);
        }
        else {
          this.loadData(+this.selectedSaloon);
        }
      });
    }
    this.visible = false
  }
  imageInputVisible: boolean  = true;
  changeImage(): void {
    this.imageInputVisible = true;
  }

  onSubmit() {
    let salonId = this.getUserData();
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.serviceForm.value.salonId = userdata.salonId;
    }
    else {
      this.serviceForm.value.salonId = this.selectedSaloon;
    }
    if (this.selectedFile) {
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.serviceForm.value.servicePic = this.selectedFileUrl;
        
        console.log(this.serviceForm)
        if (this.serviceForm.valid) {
          this._apiService.addservice(this.serviceForm.value).subscribe((res) => {
            if(res){
              this.serviceslist.unshift(res);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added successfully!' });
              if (userdata.userType != "superadmin") {
                this.loadData(userdata.salonId);
              }
              else {
                this.loadData(+this.selectedSaloon);
              }
            }
            else{
              this.filteredServices.length = 0;
              this.message = 'No Data Found'
            }
           
          });
        } else {
          console.log('Form is invalid');
        }
      });
    }
    else{
      if (true) {
        this._apiService.addservice(this.serviceForm.value).subscribe((res)=>{
          this.serviceslist.unshift(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added successfully!' });
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
    this.selectedFile = null;

    this.serviceForm.patchValue({
      status: true,
    });
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
  imgURL = ''
  populateForm(data: any) {
    this.serviceForm.patchValue({
      serviceName: data.serviceName,
      details: data.details,
      price: data.price,
      discountPrice: data.discountPrice,
      serviceType: data.serviceType,
      status: data.status,
      salonId: data.salonId
    });

    this.serviceForm.patchValue();
    console.log("Image URL:", data.servicePic);
    this.imgURL = data.servicePic;
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
      serviceType:  null,
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
        if(res){
          this.filteredServices = [...this.serviceslist];
        }
        else{
          this.filteredServices.length = 0
          this.message = 'No Data Found';
        }
        
      },err => {
       this.message = 'No Data Found'
      });
    }
    else {
      this._apiService.getServiceBySaloonId(saloonIdforSuperadmin).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
        if(res){
          this.filteredServices = [...this.serviceslist];
        }
        else{
          this.filteredServices.length = 0
          this.message = 'No Data Found';
        }
      },err => {
        this.message = "No Data Found";
        this.filteredServices.length = 0;
      });
    }

  }
  onSalonSelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedSaloon = selectedId ? Number(selectedId) : null;
    console.log('Selected Salon ID:', this.selectedSaloon);
    this.loadData(this.selectedSaloon);
    this.showAddServiceButton = true;
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
      status: [true, [Validators.required]],
      serviceType: ['', [Validators.required]]
    });
  }
}
