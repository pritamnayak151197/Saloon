import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  constructor(private _apiService: ApiService,
    private fb: FormBuilder,
    private _exportToExcelService: ExportToExcelService,
    private messageService: MessageService
  ) { }
  totalCount: any;
  serviceslist:any = [];
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


  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.serviceslist, 'service_list');
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data exported successfully!' });
  }
  
  onSubmit() {
    this._apiService.uploadImage(this.selectedFile).subscribe((res: any) =>{
      this.selectedFileUrl = res[0].url;
      this.serviceForm.value.servicePic = this.selectedFileUrl;
      let salonId = this.getUserData();
      this.serviceForm.value.salonId = salonId.salonId
      console.log(this.serviceForm)
      if (this.serviceForm.valid) {
        this._apiService.addservice(this.serviceForm.value).subscribe((res)=>{
          this.serviceslist.push(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service added successfully!' });
        });
      } else {
        console.log('Form is invalid');
      }
    });
    

    this.visible = false
    
  }


  handleCardClick(details:any){
      // this.saloonData = this.saloonList.find(salon => salon.salonId === details);
      // this.selectedCardId = details;
  }

  addServices(){
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

  ngOnInit(): void {
    let saloonId = this.getUserData();
    this.serviceForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      details: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      servicePic: [],
      discountPrice: [null, [Validators.required, Validators.min(0)]],
      status: [false, [Validators.required]],
      serviceType: ['', [Validators.required]]
    });
    
    this._apiService.getServiceBySaloonId(saloonId.salonId).subscribe((res: any) =>{
      this.serviceslist = res
      this.totalCount = res.length;
      console.log(this.serviceslist);
      // this.saloonData = this.serviceslist.find(salon => salon.salonId === 1);
    });  
  }

}
