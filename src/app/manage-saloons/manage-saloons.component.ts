import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';

@Component({
  selector: 'app-manage-saloons',
  templateUrl: './manage-saloons.component.html',
  styleUrls: ['./manage-saloons.component.css']
})
export class ManageSaloonsComponent implements OnInit {

  constructor(private _apiService: ApiService,
    private fb: FormBuilder,
    private _exportToExcelService: ExportToExcelService,
  ) { }
  totalCount: any;
  saloonList: Salon[] = [];
  saloonData: any;
  selectedCardId = 1;
  visible = false;
  salonForm: any;
  responseDataSubmit: any;
  inputValue: string = '';
  selectedFile: any;

  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.saloonList, 'saloon_list');
  }
  onInputChange(value: string): void {
    if (value.length === 3) {
      this.triggerFunction(value);
    }
  }

  triggerFunction(value: string): void {
  //  this.saloonList = this.saloonList.filter(salon => salon.salonName === value);
  }

  onSubmit(){
    if (this.salonForm.valid) {
      console.log(this.salonForm.value);
      this._apiService.addSaloon(this.salonForm.value).subscribe((data) =>{
        this.responseDataSubmit = data;
        this.saloonList.push(this.responseDataSubmit.data)
      });
      this.visible = false;
    }
  }


  handleCardClick(details:any){
      this.saloonData = this.saloonList.find(salon => salon.salonId === details);
      this.selectedCardId = details;
  }

  addSaloon(){
    this.visible = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  isInvalid(controlName: string): boolean {
    const control = this.salonForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  ngOnInit(): void {
    this._apiService.getSaloonList().subscribe((res: any) =>{
      this.saloonList = res
      this.totalCount = res.length
      this.saloonData = this.saloonList.find(salon => salon.salonId === 1);
    });
    this.salonForm = this.fb.group({
      salonId: ['', Validators.required],
      salonName: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', Validators.required],
      addressUrl: ['', Validators.required],
      salonLogo: ['', Validators.required],
      registeredOn: ['', Validators.required],
      trialPeriodStartDate: ['', Validators.required],
      status: [false, Validators.required],
      qrCode: ['', Validators.required],
      sms: [false, Validators.required],
      coupon: [false, Validators.required],
      membership: [false, Validators.required]
    });

    
  }

}
