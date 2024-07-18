import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-saloons',
  templateUrl: './manage-saloons.component.html',
  styleUrls: ['./manage-saloons.component.css']
})
export class ManageSaloonsComponent implements OnInit {

  constructor(private _apiService: ApiService,
    private fb: FormBuilder,
    private _exportToExcelService: ExportToExcelService,
    private router: Router,
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
  editSaloonData = false;
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  userName = '';
  password = '';
  adminDetails: any;
  createAdmin = false;
  

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
        this.saloonList.push(this.responseDataSubmit.data);
        this.createAdmin = true;
      });
    }
  }
  createAdminForSalon(userName: string, password: string){
    let body = {
      salonId: this.responseDataSubmit.Data.salonId,
      username: userName,
      password: password,
      phone: this.salonForm.value.phone,
      prefix: 'krati'
    };

    this._apiService.addAdmin(body).subscribe((res)=>{
      this.adminDetails = res;
      this.visible = false;
    })
  }

  onEdit(){
    this._apiService.updateSaloonById(this.salonForm.value).subscribe((data) =>{
      this.responseDataSubmit = data;
      this.saloonList.push(this.responseDataSubmit.data);
      this.editSaloonData = false;
      this.loaddata();
    });
    
  }

  editSaloon(){
    console.log(this.saloonData);
    this.editSaloonData = true;
    this.populateForm(this.saloonData);
  }
  populateForm(data: any) {
    this.salonForm.patchValue({
      salonName: data.salonName,
      phone: data.phone,
      address: data.address,
      addressUrl: data.addressUrl,
      salonLogo: data.salonLogo,
      qrCode: data.qrCode,
      subscriptionStartDate: data.subscriptionStartDate,
      subscriptionEndDate: data.subscriptionEndDate,
      status: data.status,
      sms: data.sms,
      coupon: data.coupon,
      membership: data.membership
    });
  }
  clearData() {
    this.salonForm.patchValue({
      salonName: null,
      phone: null,
      address: null,
      addressUrl: null,
      salonLogo: null,
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      qrCode: null,
      status: null,
      sms: null,
      coupon: null,
      membership: null
    });
    this.userName = '';
    this.password = '';
  }
  saloonId = null;
  onRightClick(event: MouseEvent, salonId: any) {
    this.saloonId = salonId
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuVisible = true;
  }

  onAction(action: string) {
    if(action == "packages"){
      this.router.navigate(['Layout/Services', this.saloonId]);

    }
    console.log(action);
    this.contextMenuVisible = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.contextMenuVisible = false;
  }


  handleCardClick(details:any){
      this.saloonData = this.saloonList.find(salon => salon.salonId === details);
      this.selectedCardId = details;
  }

  addSaloon(){
    this.clearData();
    this.visible = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  isInvalid(controlName: string): boolean {
    const control = this.salonForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  loaddata(){
    this._apiService.getSaloonList().subscribe((res: any) =>{
      this.saloonList = res
      this.totalCount = res.length
      this.saloonData = this.saloonList.find(salon => salon.salonId === 1);
    });
  }

  ngOnInit(): void {
    this.loaddata();
    this.salonForm = this.fb.group({
      salonName: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', Validators.required],
      addressUrl: ['', Validators.required],
      salonLogo: ['', Validators.required],
      registeredOn: ['', Validators.required],
      subscriptionStartDate: ['', Validators.required],
      subscriptionEndDate: ['', Validators.required],
      status: [false, ],
      qrCode: ['', Validators.required],
      sms: [false, ],
      coupon: [false, ],
      membership: [false, ]
    });

    
  }

}
