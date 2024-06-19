import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salon } from './assets/saloon.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient){}
  private baseUrl = 'https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/';
  

  login(param : any){
    return this.http.post(`https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/admin/v1/login/usernameOrPhone`, param);
  }

  logInWithOtp(param: any){
    return this.http.post(`https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/otp/request`, param);
  }
  validateOtp(param: any){
    return this.http.post(`https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/otp/validate`, param);
  }

  getSaloonList(){
    return this.http.get('https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/salon/viewList');
  }

  addSaloon(body:any){
    return this.http.post('https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/salon/addSalon', body);
  }

  getServiceBySaloonId(saloonId: any): Observable<any> {
    const url = `${this.baseUrl}services/getBySalonId/${saloonId}`;
    return this.http.get(url);
  }

  getPackagesBySaloonId(saloonId: any) {
    const url = `${this.baseUrl}package/getListBySalonId/${saloonId}`;
    return this.http.get(url);
  }

  uploadImage(body: any){
    const formData = new FormData();
    formData.append('file', body);
    const url = `${this.baseUrl}file/upload`;
    return this.http.post(url, formData);
  }

  addservice(body: any){
    return this.http.post('https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/services/add', body);
  }
}
