import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon, Service } from '../../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


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
  isLoading = false;


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
    // Validate form data
    const validationErrors = this.formValidator();
    if (validationErrors) {
      this.message = this.getValidationMessage(validationErrors);
      return;
    }
  
    // Retrieve user data
    const userdata = this.getUserData();
    if (userdata.userType !== "superadmin") {
      this.serviceForm.value.salonId = userdata.salonId;
    } else {
      this.serviceForm.value.salonId = this.selectedSaloon;
    }
  
    // Handle file upload
    if (this.selectedFile) {
      this.isLoading = true;
      this._apiService.uploadImage(this.selectedFile).subscribe(
        (res: any) => {
          // On successful image upload
          this.selectedFileUrl = res[0].url;
          this.serviceForm.value.servicePic = this.selectedFileUrl;
          this.serviceForm.value.serviceId = this.serviceIdforEdit;
  
          // Update service
          this._apiService.updateServiceById(this.serviceForm.value).subscribe(
            (res) => {
              // On successful service update
              this.editVisible = false;
              if (userdata.userType !== "superadmin") {
                this.loadData(userdata.salonId);
              } else {
                this.loadData(+this.selectedSaloon);
              }
              this.isLoading = false;
            },
            (error) => {
              // Handle error during service update
              this.isLoading = false;
              console.error('Service update failed', error);
              alert('Failed to update service. Please try again later.');
            }
          );
        },
        (error) => {
          // Handle error during image upload
          this.isLoading = false;
          console.error('Image upload failed', error);
          // alert('Failed to upload image. Please try again later.');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Username or Password is incorrect' });
        }
      );
    } else {
      // Handle case when no file is selected
      this.serviceForm.value.serviceId = this.serviceIdforEdit;
      this.serviceForm.value.servicePic = this.editServiceForm.servicePic;
      this._apiService.updateServiceById(this.serviceForm.value).subscribe(
        (res) => {
          // On successful service update
          this.isLoading = true;
          this.editVisible = false;
          if (userdata.userType !== "superadmin") {
            this.loadData(userdata.salonId);
          } else {
            this.loadData(+this.selectedSaloon);
          }
          this.isLoading = false;
        },
        (error) => {
          // Handle error during service update
          this.isLoading = false;
          console.error('Service update failed', error);
          alert('Failed to update service. Please try again later.');
        }
      );
      this.isLoading = false;
    }
  
    this.visible = false;
  }
  
  imageInputVisible: boolean = true;
  changeImage(): void {
    this.imageInputVisible = true;
  }

  onSubmit() {

    const validationErrors = this.formValidator();
    if (validationErrors) {
      this.message = this.getValidationMessage(validationErrors);
      return;
    }
    let salonId = this.getUserData();
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.serviceForm.value.salonId = userdata.salonId;
    }
    else {
      this.serviceForm.value.salonId = this.selectedSaloon;
    }
    if (this.selectedFile) {
      this.isLoading = true;
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.serviceForm.value.servicePic = this.selectedFileUrl;

        console.log(this.serviceForm)

          this._apiService.addservice(this.serviceForm.value).subscribe((res) => {
            if (res) {
              this.serviceslist.unshift(res);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added successfully!' });
              if (userdata.userType != "superadmin") {
                this.loadData(userdata.salonId);
                this.isLoading = false;
              }
              else {
                this.loadData(+this.selectedSaloon);
                this.isLoading = false;
              }
            }
            else {
              this.filteredServices.length = 0;
              this.message = 'No Data Found'
              this.isLoading = false;
            }

          });
      });
    }
    else {
      if (true) {
        this.isLoading = true;
        this._apiService.addservice(this.serviceForm.value).subscribe((res) => {
          this.serviceslist.unshift(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added successfully!' });
          if (userdata.userType != "superadmin") {
            this.loadData(userdata.salonId);
            this.isLoading = false;
          }
          else {
            this.loadData(+this.selectedSaloon);
            this.isLoading = false;
          }
        });
      } else {
        console.log('Form is invalid');
        this.isLoading = false;
      }
    }


    this.visible = false;


  }

  getValidationMessage(errors: ValidationErrors): string {
    if (errors['serviceNameRequired']) return errors['serviceNameRequired'];
    if (errors['serviceTypeRequired']) return errors['serviceTypeRequired'];
    if (errors['detailsRequired']) return errors['detailsRequired'];
    if (errors['priceInvalid']) return errors['priceInvalid'];
    if (errors['discountPriceInvalid']) return errors['discountPriceInvalid'];
    return 'Please correct the errors in the form.';
  }


  handleCardClick(details: any) {
    this.serviceIdforEdit = details;
    this.editServiceForm = this.serviceslist.find((service: any) => service.serviceId === details);
    this.editVisible = true;
    this.openEditDialog(this.editServiceForm);
    this.message = '';
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
      serviceType: null,
      salonId: null
    });
    this.message = '';
  }

  loadData(saloonIdforSuperadmin: any) {
    if (saloonIdforSuperadmin == null) {
      let saloonId = this.getUserData();
      this._apiService.getServiceBySaloonId(saloonId.salonId).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
        if (res) {
          this.filteredServices = [...this.serviceslist];
        }
        else {
          this.filteredServices.length = 0
          this.message = 'No Data Found';
        }

      }, err => {
        this.message = 'No Data Found'
      });
    }
    else {
      this._apiService.getServiceBySaloonId(saloonIdforSuperadmin).subscribe((res: any) => {
        this.serviceslist = res
        this.totalCount = res.length;
        console.log(this.serviceslist);
        if (res) {
          this.filteredServices = [...this.serviceslist];
        }
        else {
          this.filteredServices.length = 0
          this.message = 'No Data Found';
        }
      }, err => {
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
      serviceName: ['', Validators.required],
      serviceType: ['', Validators.required],
      details: ['', Validators.required],
      servicePic: [null, Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      discountPrice: ['', [Validators.min(0)]],
      status: [false]
    });
  }

  formValidator(): ValidationErrors | null {
    const errors: ValidationErrors = {};

    const serviceName = this.serviceForm.get('serviceName')?.value;
    const serviceType = this.serviceForm.get('serviceType')?.value;
    const details = this.serviceForm.get('details')?.value;
    const price = this.serviceForm.get('price')?.value;
    const discountPrice = this.serviceForm.get('discountPrice')?.value;

    if (!serviceName) {
      errors['serviceNameRequired'] = 'Service Name is required.';
    }

    if (!serviceType) {
      errors['serviceTypeRequired'] = 'Service Type is required.';
    }

    if (!details) {
      errors['detailsRequired'] = 'Details are required.';
    }


    if (price === null || price === '' || price < 0) {
      errors['priceInvalid'] = 'Price is required and must be a non-negative number.';
    }

    if (discountPrice < 0) {
      errors['discountPriceInvalid'] = 'Discount Price must be a non-negative number.';
    }

    if (discountPrice !== null && discountPrice !== '' && price !== null && price !== '' && discountPrice >= price) {
      errors['discountPriceInvalid'] = 'Discount price should be less than the regular price.';
    }

    return Object.keys(errors).length ? errors : null;
  }
}
