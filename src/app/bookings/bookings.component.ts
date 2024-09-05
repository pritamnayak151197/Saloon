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
  filteredRecords: any;

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

  loadData(){
    
    let userdata = this.getUserData();
    if (userdata.userType == "superadmin") {
      this.isSuperAdmin = true;
      this.fetchSalonDetails();
    }
    if (userdata.userType == "admin") {
      this.isAdmin = true;
      this.saloonId = userdata.salonId;
    }
    this.apiService.getSaloonList().subscribe((res) => {
      this.bookings = res;
      this.filteredRecords = this.filterRecordsWithinNext7Days(this.bookings);
      console.log('Filtered Records:', this.filteredRecords); // Debugging
    })
  }
  filterRecordsWithinNext7Days(records: any[]): any[] {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 7);

    console.log('Today:', today.toISOString()); // Debugging
    console.log('End Date:', endDate.toISOString()); // Debugging

    return records.filter(record => {
      // Assume the timestamp is in milliseconds
      const recordEndDate = new Date(record.subscriptionEndDate); 

      // Debugging
      console.log('Record End Date:', recordEndDate.toISOString());

      // Check if the recordEndDate is a valid date
      if (isNaN(recordEndDate.getTime())) {
        console.error('Invalid recordEndDate:', record.subscriptionEndDate);
        return false;
      }

      // Compare dates
      return today <= recordEndDate && recordEndDate <= endDate;
    });
  }

  
  ngOnInit(): void {
    this.loadData();
  }


  updateBooking(ibookingsd: any){
    // this.apiService.updateBooking(ibookingsd).subscribe((res) =>{
    //   this.loadData();
    // })
  }

  saveBooking(bookings:any){
    this.apiService.updateBooking(bookings).subscribe((res) =>{
      this.loadData();
    })
  }
}
