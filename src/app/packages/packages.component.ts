import { Component, OnInit , HostBinding} from '@angular/core';
import { ApiService } from '../api.service';
import { Salon, Package, Service } from '../../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
  @HostBinding('class.custom-dropdown-position') customDropdownPosition = true;
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
  selectedServices: any;
  package = {
    packageId: null,
    packageName: "",
    packageLogo: "",
    salonLogo: "",
    price: null,
    discountPrice: null,
    startDate: "",
    endDate: "",
    status: true,
    services: [],
    salonId: null
  };
  demoImage: any;
  isLoading = false;


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

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.demoImage = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.serviceslist, 'package_list');
  }


  onSubmit(form: NgForm) {

    const validationErrors = this.formValidator();
    if (validationErrors) {
      this.message = this.getValidationMessage(validationErrors);
      return;
    }
    let salonId = this.getUserData();
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.package.salonId = userdata.salonId;
    }
    else {
      this.package.salonId = this.selectedSaloon;
    }
    if (this.selectedFile) {
      this.isLoading = true;
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.package.packageLogo = this.selectedFileUrl;
        this.package.services = this.selectedServices;


        this._apiService.addPackages(this.package).subscribe((res) => {
          if (res) {
            this.serviceslist.unshift(res);
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
          }
          this.isLoading = false;
        });
      });
    }
    else { 
      this.isLoading = true;   
        this.package.services = this.selectedServices;
        this._apiService.addPackages(this.package).subscribe((res) => {
          this.serviceslist.unshift(res);
          if (userdata.userType != "superadmin") {
            this.loadData(userdata.salonId);
            this.isLoading = false; 
          }
          else {
            this.loadData(+this.selectedSaloon);
            this.isLoading = false; 
          }
        });
    }


    this.visible = false;


  }
  onEdit(form: NgForm) {
    const validationErrors = this.formValidator();
    if (validationErrors) {
      this.message = this.getValidationMessage(validationErrors);
      return;
    }
    let salonId = this.getUserData();
    let userdata = this.getUserData();
    if (userdata.userType != "superadmin") {
      this.package.salonId = userdata.salonId;
    }
    else {
      this.package.salonId = this.selectedSaloon;
    }
    if (this.selectedFile) {
      this._apiService.uploadImage(this.selectedFile).subscribe((res: any) => {
        this.selectedFileUrl = res[0].url;
        this.package.packageLogo = this.selectedFileUrl;
        this.package.services = this.selectedServices;
        this.package.packageId = this.editPackageForm.packageId;
        this.package.salonLogo = this.editPackageForm.salonLogo;
        this._apiService.updatePackageById(this.package).subscribe((res) => {

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
      this.package.services = this.selectedServices;
      this.package.packageId = this.editPackageForm.packageId;
      this.package.packageLogo = this.editPackageForm.packageLogo;
      this.package.salonLogo = this.editPackageForm.salonLogo;
      this._apiService.updatePackageById(this.package).subscribe((res) => {

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
    this.openEditDialog(this.editPackageForm);
    this.message = '';
  }

  openEditDialog(data: any) {
    this.editVisible = true;
    this.message = '';
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
    this.package = {
      packageName: data.packageName,
      price: data.price,
      discountPrice: data.discountPrice,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      services: data.services,
      salonId: data.salonId,
      packageLogo: data.packageLogo,
      salonLogo: data.salonLogo,
      packageId: data.packageId
    };
    this.imgUrl = data.packageLogo;
    const editData = data.services;
    const dateStr = this.arrayToDateStr(data.startDate);
    this.packageForm.value.startDate = dateStr


    this.selectedServices = editData.map((service: { serviceId: any; }) => service.serviceId);

  }

  arrayToDateStr(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    const monthStr = (month + 1).toString().padStart(2, '0'); // Adjust for zero-indexed months
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  }

  clearData() {
    this.package = {
      packageName: '',
      price: null,
      discountPrice: null,
      startDate: '',
      endDate: '',
      status: false,
      services: [],
      salonId: null,
      packageLogo: '',
      salonLogo: '',
      packageId: null
    };
    this.message = '';

    this.selectedServices = [];
    this.selectedFile = null;
  }
  onEditSubmit() { }

  addSaloon() {
    this.clearData();
    this.visible = true;
    this.demoImage = null;
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
    this.selectedServices = this.packageForm.get('services').value as number[];

    if (e.target.checked) {
      this.selectedServices.push(parseInt(e.target.value, 10));
    } else {
      const index = this.selectedServices.indexOf(parseInt(e.target.value, 10));
      if (index > -1) {
        this.selectedServices.splice(index, 1);
      }
    }

    this.packageForm.patchValue({ services: this.selectedServices });
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

  discountPriceValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const price = formGroup.get('price')?.value;
    const discountPrice = formGroup.get('discountPrice')?.value;

    if (discountPrice !== null && discountPrice !== '' && price !== null && price !== '' && discountPrice >= price) {
      return { discountPriceInvalid: 'Discount price should be less than the regular price.' };
    }
    return null;
  };

  // Custom validator for date range
  dateRangeValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { dateRangeInvalid: 'Start date must be prior to end date.' };
    }
    return null;
  };

  // Form validator function to handle all validations
  formValidator(): ValidationErrors | null {
    const errors: ValidationErrors = {};

    const packageName = this.package.packageName;
    const price = this.package.price;
    const discountPrice = this.package.discountPrice;
    const startDate = this.package.startDate;
    const endDate = this.package.endDate;

    if (!packageName) {
      errors['packageNameRequired'] = 'Package Name is required.';
    }

    if (price === null || price === '' || price < 0) {
      errors['priceInvalid'] = 'Price is required and must be a non-negative number.';
    }

    if (discountPrice !== null && discountPrice < 0) {
      errors['discountPriceInvalid'] = 'Discount Price must be a non-negative number.';
    }

    if (!startDate) {
      errors['startDateRequired'] = 'Start Date is required.';
    }

    if (!endDate) {
      errors['endDateRequired'] = 'End Date is required.';
    }

    if (discountPrice !== null && discountPrice !== '' && price !== null && price !== '' && discountPrice >= price) {
      errors['discountPriceInvalid'] = 'Discount price should be less than the regular price.';
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      errors['dateRangeInvalid'] = 'Start date must be prior to end date.';
    }

    if(this.selectedServices.length < 2){
      errors['dateRangeInvalid'] = 'Select atleast 2 services';
    }
    

    return Object.keys(errors).length ? errors : null;
  }

  getValidationMessage(errors: ValidationErrors): string {
    if (errors['packageNameRequired']) return errors['packageNameRequired'];
    if (errors['priceInvalid']) return errors['priceInvalid'];
    if (errors['discountPriceInvalid']) return errors['discountPriceInvalid'];
    if (errors['startDateRequired']) return errors['startDateRequired'];
    if (errors['endDateRequired']) return errors['endDateRequired'];
    if (errors['dateRangeInvalid']) return errors['dateRangeInvalid'];
    if (errors['selectServiceInvalid']) return errors['selectServiceInvalid'];
    return 'Please correct the errors in the form.';
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
      discountPrice: [null, [Validators.min(0)]],
      startDate: [null, Validators.required],
      packageLogo: [null], // Optional
      endDate: [null, Validators.required],
      status: [true, Validators.required]
    }, { validators: [this.discountPriceValidator, this.dateRangeValidator] });
  }

}
