import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  customerId: string = '';
  bookingDetails: any;
  bookings: any;
  custommerList : any;
  show = false;

  constructor( private apiService : ApiService) {}

  fetchCustommerDetails() {
    // custommer
   
  }

  saloonList: any;
  fetchSalonDetails(){
    this.apiService.getSaloonList().subscribe((res) => {
      this.saloonList = res
      this.saloonList.unshift({
        "salonName": "Select",
        "salonId": 0,
      })
    })
  }

  onSaloonSelect(event : any){
    const selectedCustomerId = (event.target as HTMLSelectElement).value;
    this.apiService.getAllCustommerdetails(+selectedCustomerId).subscribe((res) =>{
      this.custommerList = res;
      this.custommerList.unshift({
        "customerId": 0,
        "name": "Select",
        "phone": "",
        "email": "",
        "startDate": [],
        "birthDate": null,
        "birthMonth": null,
        "gender": "",
        "type": "",
        "prefix": "",
        "locality": ""
      });
    })
    this.show = true;
  }

  userData : any; 
  getUserData(): any {
    this.userData = localStorage.getItem('userData');
    return JSON.parse(this.userData);
  }
  isSuperAdmin = false;
  isAdmin = false;
  saloonId: any;
  ngOnInit(): void {

    let userdata = this.getUserData();
    if (userdata.userType == "superadmin") {
      this.isSuperAdmin = true;
      this.fetchSalonDetails();
    }
    if (userdata.userType == "admin") {
      this.isAdmin = true;
      this.saloonId = userdata.salonId;
    }
    this.apiService.viewAllBookings().subscribe((res) => {
      this.bookings = res;
    })
  }


  updateBooking(ibookingsd: any){
    this.apiService.updateBooking(ibookingsd).subscribe((res) =>{
      
    })
  }

  saveBooking(bookings:any){
    this.apiService.updateBooking(bookings).subscribe((res) =>{
      
    })
  }
}
