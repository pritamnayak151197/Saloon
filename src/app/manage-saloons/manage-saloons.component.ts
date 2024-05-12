import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Salon } from '../assets/saloon.interface';


@Component({
  selector: 'app-manage-saloons',
  templateUrl: './manage-saloons.component.html',
  styleUrls: ['./manage-saloons.component.css']
})
export class ManageSaloonsComponent implements OnInit {

  constructor(private _apiService: ApiService) { }
  totalCount: any;
  saloonList: Salon[] = [];
  saloonData: any;
  selectedCardId = 1;
  visible = false;



  handleCardClick(details:any){
      this.saloonData = this.saloonList.find(salon => salon.salonId === details);
      this.selectedCardId = details;
  }

  addSaloon(){
    this.visible = true;
  }

  ngOnInit(): void {
    this._apiService.getSaloonList().subscribe((res: any) =>{
      this.saloonList = res
      this.totalCount = res.length
      this.saloonData = this.saloonList.find(salon => salon.salonId === 1);
    });

    
  }

}
