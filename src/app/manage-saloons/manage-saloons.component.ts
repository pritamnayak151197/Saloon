import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../../assets/saloon.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExportToExcelService } from '../export-to-excel.service';
import { Router } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';

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
  saloonId2 : any;
  filteredServices: Salon[] = [];
  searchText: string = '';
  selectedFile2: any
  message = ''
  

  exportToExcel(): void {
    this._exportToExcelService.exportToExcel(this.saloonList, 'saloon_list');
  }
  onInputChange(value: string): void {
    if (value.length === 3) {
      this.triggerFunction(value);
    }
  }
  filterServices() {
    this.filteredServices = this.saloonList.filter((Salon: { salonName: string; phone: { toString: () => string; } }) => {
      const searchTerm = this.searchText.toLowerCase();
      return Salon.salonName.toLowerCase().includes(searchTerm) ||
      Salon.phone.toString().toLowerCase().includes(searchTerm)
    });
  }
  triggerFunction(value: string): void {
  //  this.saloonList = this.saloonList.filter(salon => salon.salonName === value);
  }
  onFileSelected3(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onFileSelected4(event: any): void {
    this.selectedFile2 = event.target.files[0];
  }
 

  onSubmit(){
    if (this.selectedFile || this.selectedFile2) {
      this._apiService.uploadImage(this.selectedFile).pipe(
        switchMap((res1: any) => {
          // First image upload response
          this.selectedFile = res1[0].url;
          this.salonForm.value.salonLogo = this.selectedFile;
      
          // Upload the second image
          return this._apiService.uploadImage(this.selectedFile2);
        }),
        switchMap((res2: any) => {
          // Second image upload response
          this.selectedFile2 = res2[0].url;
          this.salonForm.value.qrCode = this.selectedFile2;
      
          // After both images are uploaded, call the addSaloon API
          if (this.salonForm.valid) {
            return this._apiService.addSaloon(this.salonForm.value);
          } else {
            throw new Error('Form is invalid');
          }
        })
      ).subscribe({
        next: (data) => {
          // Handle the response from addSaloon API
          this.responseDataSubmit = data;
          this.saloonList.push(this.responseDataSubmit.data);
          this.createAdmin = true;
          this.loaddata();
        },
        error: (err) => {
          this.message = err.error.message
        }
      });
      
    }
    else{
      if (this.salonForm.valid) {
        console.log(this.salonForm.value);
        this._apiService.addSaloon(this.salonForm.value).subscribe((data) =>{
          this.responseDataSubmit = data;
          this.saloonList.push(this.responseDataSubmit.data);
          this.createAdmin = true;
          this.loaddata();
        });
      }
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
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this._apiService.uploadImage(this.selectedFile).subscribe((res: any) =>{
      this.saloonLogo = res;
    })
  }

  onFileSelected2(event: any): void {
    this.selectedFile2 = event.target.files[0];

    this._apiService.uploadImage(this.selectedFile2).subscribe((res: any) =>{
      this.qrCode = res;
    })
  }

  onEdit(){

    if (!this.selectedFile || !this.selectedFile2) {
    this.salonForm.value['salonId'] = this.saloonId2;
    this.salonForm.value['salonLogo'] = this.selectedFile;
    this.salonForm.value['qrCode'] = this.selectedFile;
    this._apiService.updateSaloonById(this.salonForm.value).subscribe((data) =>{
      this.responseDataSubmit = data;
      this.saloonList.push(this.responseDataSubmit.data);
      this.editSaloonData = false;
      this.loaddata();
    }, err =>{
      alert(err.error.message)
    });
  }
  else{
    if(this.saloonLogo){
      this.salonForm.value['salonLogo'] = this.saloonLogo[0].url;
    }
    if(this.qrCode){
      this.salonForm.value['qrCode'] = this.qrCode[0].url;
    }
    this.salonForm.value['salonId'] = this.saloonId2;
    this.salonForm.value['services'] = this.selectedFile;
    this._apiService.updateSaloonById(this.salonForm.value).subscribe((data) =>{
      this.responseDataSubmit = data;
      this.saloonList.push(this.responseDataSubmit.data);
      this.editSaloonData = false;
      this.loaddata();
    });
  }
  }
 
  editSaloon(id : any){
    this.clearData();
    this.saloonId2 = id;
    console.log(this.saloonData);
    this.editSaloonData = true;
    this.populateForm(this.saloonData);
  }
  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  saloonLogo: any;;
  qrCode: any;
  populateForm(data: any) {
    this.salonForm.patchValue({
      salonName: data.salonName,
      phone: data.phone,
      address: data.address,
      addressUrl: data.addressUrl,
      registeredOn: this.formatDate(data.registeredOn),
      subscriptionStartDate: this.formatDate(data.subscriptionStartDate),
      subscriptionEndDate: this.formatDate(data.subscriptionEndDate),
      status: data.status,
      sms: data.sms,
      coupon: data.coupon,
      membership: data.membership
    });
    console.log(this.salonForm.value)
    this.saloonLogo = data.salonLogo;
    this.qrCode = data.qrCode;
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
    this.selectedFile = null;
    this.selectedFile2 = null;
    this.message = '';
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

    this.salonForm.patchValue({
      status: true,
      sms: true
    });
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
      this.filteredServices = [...this.saloonList];
    });
  }

  ngOnInit(): void {
    this.loaddata();
    this.salonForm = this.fb.group({
      salonName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      address: ['', Validators.required],
      addressUrl: ['', Validators.required],
      salonLogo: ['', Validators.required],
      registeredOn: [new Date().toISOString().substring(0, 10), Validators.required],
      subscriptionStartDate: ['', Validators.required],
      subscriptionEndDate: ['', Validators.required],
      status: [true, ],
      qrCode: ['', Validators.required],
      sms: [false, ],
      coupon: [false, ],
      membership: [false, ]
    });

    
  }

}
