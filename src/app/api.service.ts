import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salon } from './assets/saloon.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient){}
  baseUrl = "https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon"

  login(param : any){
    return this.http.post(`https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/admin/v1/login/usernameOrPhone`, param);
  }

  getSaloonList(): Observable<Salon[]>{
    return this.http.get<Salon[]>('https://0qyq8zjv0f.execute-api.ap-south-1.amazonaws.com/Salon/salon/viewList')
  }
}
