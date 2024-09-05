import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salon } from '../assets/saloon.interface';
import { Service } from '../assets/saloon.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient){}
  private baseUrl = 'http://salon-env.eba-ncmipgef.ap-south-1.elasticbeanstalk.com';
  

  login(param : any){
    return this.http.post('http://salon-env.eba-ncmipgef.ap-south-1.elasticbeanstalk.com/admin/v1/login/usernameOrPhone', param);
  }

  
  logInWithOtp(param: any){
    return this.http.post(`http://testapp-env.eba-4t2jzzh3.ap-south-1.elasticbeanstalk.com/otp/request`, param);
  }
  validateOtp(param: any){
    return this.http.post(`http://testapp-env.eba-4t2jzzh3.ap-south-1.elasticbeanstalk.com/otp/validate`, param);
  }

  getSaloonList(){
    const url = `http://salon-env.eba-ncmipgef.ap-south-1.elasticbeanstalk.com/salon/viewList`;
    return this.http.get(url);
  }

  getSaloonList2(){
    return this.http.get('https://98aa-152-58-93-216.ngrok-free.app/salon/viewList');
  }
  getSaloonListById(saloonId: any){
    const url = `${this.baseUrl}/salon/getDataBySalonId/${saloonId}`;
    return this.http.get(url);
  }

  addSaloon(body:any){
    const url = `${this.baseUrl}/salon/addSalon`;
    return this.http.post(url, body);
  }

  getServiceBySaloonId(saloonId: any): Observable<any> {
    const url = `http://salon-env.eba-ncmipgef.ap-south-1.elasticbeanstalk.com/services/getBySalonId/${saloonId}`;
    return this.http.get(url);
  }

  getPackagesBySaloonId(saloonId: any) {
    const url = `${this.baseUrl}/package/getListBySalonId/${saloonId}`;
    return this.http.get(url);
  }

  uploadImage(body: any){
    const formData = new FormData();
    formData.append('file', body);
    const url = `${this.baseUrl}/file/upload`;
    return this.http.post(url, formData);
  }

  addPackages(body: any){
    const url = `${this.baseUrl}/package/addPackage`;
    return this.http.post(url, body);
  }

  updateServiceById(updatedFormData: any){
    const url = `${this.baseUrl}/services/update`;
    return this.http.put(url, updatedFormData);
  }

  updatePackageById(updatedFormData: any){
    const url = `${this.baseUrl}/package/updatePackages`;
    return this.http.put(url, updatedFormData);
  }
  
  updateSaloonById(updatedFormData: any){
    const url = `${this.baseUrl}/salon/updateSalon`;
    return this.http.put(url, updatedFormData);
  }

  addservice(body: any){
    const url = `${this.baseUrl}/services/add`;
    return this.http.post(url, body);
  }

  addAdmin(body: any){
    const url = `${this.baseUrl}/admin/v1/add`;
    return this.http.post(url, body);
  }



  fetchNotifications(saloonId:any): Observable<any> {
    const url = `${this.baseUrl}/notifications/generateAndFetchBySalonId/${saloonId}`;
    return this.http.post(url,null);
  }


  getOrderHistoryByCustommerId(id:any){
    const url = `http://salon-env.eba-ncmipgef.ap-south-1.elasticbeanstalk.com/booking/viewAllBookingsByCustomerId/${id}`;
    return this.http.get(url);
  }

  getPackageById(id: any){
    const url = `http://salon-env.eba-ncmipgef.ap-south-1.elasticbeanstalk.com/package/getPackageById/${id}`;
    return this.http.get(url);
  }


  custommerLogin(number: any, prifix: any){
    const url = `${this.baseUrl}/customer/getByPhoneAndPrefix?phone=${number}&prefix=${prifix}`;
    return this.http.get(url);
  }

  addCustommer(param : any){
    const url = `${this.baseUrl}/customer/add`;
    return this.http.post(url, param);
  }

  addToCart(param: any){
    const url = `${this.baseUrl}/cart/add`;
    return this.http.post(url, param);
  }

  getItemsForCart(saloonId : any, custommerid : any){
    const url = `${this.baseUrl}/cart/customer/${custommerid}/salon/${saloonId}`;
    return this.http.get(url);
  }

  removeItemfromCart(param: any){
    const url = `${this.baseUrl}/cart/update`;
    return this.http.put(url, param);
  }

  updateCustommer(param : any){
    const url = `${this.baseUrl}/customer/update`;
    return this.http.put(url, param);
  }


  getUserByPhone(phone : any){
    const url = `${this.baseUrl}/customer/getByPhoneAndPrefix?phone=${phone}&prefix=krati`;
    return this.http.get(url);
  }

  placeOrder(param : any){
    const url = `${this.baseUrl}/booking/add`;
    return this.http.post(url, param);
  }

  clearTheCart(Cid: any, sId: any){
    const url = `${this.baseUrl}/cart/clearAll?customerId=${Cid}&salonId=${sId}`;
    return this.http.put(url, null);
  }

  getAllCustommerdetails(Id: any){
    const url = `${this.baseUrl}/customer/viewCustomerListBySalonId/${Id}`;
    return this.http.get(url);
  }

  viewBookingsBySalonId(Id: any){
    const url = `${this.baseUrl}/booking/viewAllBookingsBySalonId/${Id}`;
    return this.http.get(url);
  }

  updateBooking(Booking : any){
    const url = `${this.baseUrl}/booking/update`;
    return this.http.put(url, Booking);
  }

  viewAllBookings(){
    const url = `${this.baseUrl}/booking/viewAllBookings`;
    return this.http.get(url);
  }

  getServicesById(Id : any){
    const url = `${this.baseUrl}/services/getById/${Id}`;
    return this.http.get<Service>(url);
  }
}
