import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCountSource = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSource.asObservable();
  userData: any;
  salonId = 1;

  constructor(private apiService: ApiService) {}

  loadData() {
    this.userData = localStorage.getItem('userData');
    return this.userData ? JSON.parse(this.userData) : null;
  }

  updateCartCount() {
    const custommerid = this.loadData();
    this.apiService.getItemsForCart(this.salonId, custommerid.customerId).subscribe((res: any) => {
      const totalSQuantity = res.services.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0);
      const totalPQuantity = res.Packages.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0);
      this.cartCount$ = totalSQuantity + totalPQuantity;
      // this.cartCountSource.next(count);
    });
  }
}
