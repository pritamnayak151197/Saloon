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
    const url = `${this.baseUrl}admin/v1/login/usernameOrPhone`;
    return this.http.post(url, param);
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

  addPackages(body: any){
    const url = `${this.baseUrl}package/addPackage`;
    return this.http.post(url, body);
  }

  updateServiceById(updatedFormData: any){
    const url = `${this.baseUrl}services/update`;
    return this.http.put(url, updatedFormData);
  }

  updatePackageById(updatedFormData: any){
    const url = `${this.baseUrl}package/updatePackages`;
    return this.http.put(url, updatedFormData);
  }
  
  updateSaloonById(updatedFormData: any){
    const url = `${this.baseUrl}salon/updateSalon`;
    return this.http.put(url, updatedFormData);
  }

  addservice(body: any){
    return this.http.post('https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/services/add', body);
  }





  fetchNotifications(saloonId:any): Observable<any> {
    const url = `${this.baseUrl}notifications/generateAndFetchBySalonId/${saloonId}`;
    return this.http.post(url,null);
  }
}
