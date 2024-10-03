import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  customerId: string = '';
  bookingDetails: any;
  bookings: any;
  custommerList: any;
  show = false;
  message = '';
  isVisible = false;

  showMessage(message: string, duration: number = 3000) {
    this.message = message;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
    }, duration);
  }

  constructor(private apiService: ApiService) { }

  fetchCustommerDetails() {
    // custommer

  }

  saloonList: any;
  fetchSalonDetails() {
    this.apiService.getSaloonList().subscribe((res) => {
      this.saloonList = res
      this.saloonList.unshift({
        "salonName": "Select",
        "salonId": 0,
      })
    })
  }

  onSaloonSelect(event: any) {
    const selectedCustomerId = (event.target as HTMLSelectElement).value;
    this.apiService.getAllCustommerdetails(+selectedCustomerId).subscribe((res) => {
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


  userData: any;
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
    this.apiService.viewBookingsBySalonId(userdata.salonId).subscribe((res) => {
      this.bookings = res;
      if (this.bookings) {
        this.message = 'No Data Found'
      }
    })
  }


  updateBooking(ibookingsd: any) {
    this.apiService.updateBooking(ibookingsd).subscribe((res) => {

    })
  }

  saveBooking(bookings: any) {
    this.apiService.updateBooking(bookings).subscribe((res) => {
      this.showMessage("Booking Updated successfully!");
    })
  }

  onStatusChange(booking: any) {
    console.log(`Booking ID: ${booking.bookingId}, New Status: ${booking.status}`);
    // Here, you could also call an API to update the status
  }
}
