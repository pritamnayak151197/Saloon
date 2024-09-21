import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { formatDate } from '@angular/common';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {

  constructor(private ApiService: ApiService,
    private sharedService: SharedService
  ) {

  }

  salonId: any;
  custommerId = 15
  cartItems: any;
  userData: any;
  param: any;
  cartId: any;
  expandedPackages: any[] = [];
  expandedServices: any[] = [];
  displayModal: boolean = false;
  displayModal2: boolean = false;
  slotAllocatedDate: string = '';
  slotAllocatedTime: string = '';
  remarks: string = '';
  qrCodeUrl: any;
  selectedPaymentMode = '';
  packages: any;
  services: any;

  addToCart() {
    // Logic to add the product to the cart
    alert('Waiting for saloons approval');
  }

  loadData() {
    this.userData = localStorage.getItem('userData');
    return this.userData ? JSON.parse(this.userData) : null;
  }

  loadCartDetails() {
    const custommerid = this.loadData();
    const prefix = this.loadData()
    this.ApiService.getDetailsByPrefix(prefix.prefix).subscribe((res: any)=>{
      this.salonId = res.salonId;
      this.ApiService.getItemsForCart(this.salonId, custommerid.customerId).subscribe((res: any) => {
        this.cartItems = res;
        this.cartId = this.cartItems.cartId
        this.packages = res.packages
        this.services = res.services;
  
        // Expand packages based on quantity
        this.expandedPackages = this.cartItems.packages.flatMap((pkg: { quantity: any; }) =>
          Array(pkg.quantity).fill(pkg)
        );
  
        // Expand services based on quantity
        this.expandedServices = this.cartItems.services.flatMap((service: { quantity: any; }) =>
          Array(service.quantity).fill(service)
        );
  
        if (this.packages.length > 0 || this.services.length > 0) {
          this.placeOrderButton = true;
        }
        else{
          this.placeOrderButton = false;
        }
      })
      this.param = {
        cartId: this.cartId,
        customerId: custommerid.customerId,
        salonId: this.salonId,
        packageIds: [],
        serviceIds: []
      }
      this.sharedService.triggerButtonClick();
    })

    

  }
  placeOrderButton = false;
  ngOnInit(): void {
    this.loadCartDetails();

    this.ApiService.getSaloonListById(48).subscribe((res) => {
      this.qrCodeUrl = res;
    })


  }

  finalObject: any;
  removeitem(packageId: any, name: string, quantity: any) {
    const cardObject = {
      [packageId]: quantity
    };
    if (name == 'package') {
      this.finalObject = this.createFinalObject(cardObject, null)
    }
    else {
      this.finalObject = this.createFinalObject(null, cardObject)
    }

    this.ApiService.removeItemfromCart(this.finalObject).subscribe((res) => {
      this.loadCartDetails();
    })
  }
  removeQuantity(packageId: any, name: string, quantity: any) {
    const cardObject = {
      [packageId]: 1
    };
    if (name == 'package') {
      this.finalObject = this.createFinalObject2(cardObject, null)
    }
    else {
      this.finalObject = this.createFinalObject2(null, cardObject)
    }

    this.ApiService.removeItemfromCart(this.finalObject).subscribe((res) => {
      this.loadCartDetails();
    })
  }
  addQuantity(packageId: any, name: string, quantity: any) {
    const cardObject = {
      [packageId]: 1
    };
    if (name == 'package') {
      this.finalObject = this.createFinalObject2(cardObject, null)
    }
    else {
      this.finalObject = this.createFinalObject2(null, cardObject)
    }

    this.ApiService.addToCart(this.finalObject).subscribe((res) => {
      this.loadCartDetails();
    })
  }

  createFinalObject(item1: any, item2: any) {
    const custommerid = this.loadData();
    return {
      customerId: custommerid.customerId,
      salonId: this.salonId,
      packageIds: item1,
      serviceIds: item2,
    };
  }

  createFinalObject2(item1: any, item2: any) {
    const custommerid = this.loadData();
    return {
      customerId: custommerid.customerId,
      salonId: this.salonId,
      packageIds: item1,
      serviceIds: item2
    };
  }

  placeOrder() {
    const custommerId = this.loadData();
    const packageObj = this.expandedPackages.reduce((acc, pkg) => {
      acc[String(pkg.packageId)] = pkg.quantity;  // Convert key to string
      return acc;
    }, {});

    const serviceObj = this.expandedServices.reduce((acc, svc) => {
      acc[String(svc.serviceId)] = svc.quantity;  // Convert key to string
      return acc;
    }, {});

    const now = new Date();
    const bookingDate = formatDate(now, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    const slotAllocatedDate = this.slotAllocatedDate || formatDate(now, 'yyyy-MM-dd', 'en-US');
    const slotAllocatedTime = this.slotAllocatedTime || formatDate(now, 'HH:mm:ss', 'en-US');

    const orderPayload = {
      customerId: custommerId.customerId,
      bookingDate: bookingDate,
      slotAllocatedDate: slotAllocatedDate,
      slotAllocatedTime: slotAllocatedTime,
      status: true,
      remarks: this.remarks,
      advancePayment: null,
      bookingConfirm: null,
      packageQuantities: packageObj,
      serviceQuantities: serviceObj,
      salonId: this.salonId
    };
    this.ApiService.placeOrder(orderPayload).subscribe((res) => {
      this.ApiService.clearTheCart(custommerId.customerId, 48).subscribe(() => {
        this.loadCartDetails();
      });
    })

    this.hideDialog();
    if(this.selectedPaymentMode == 'upi'){
      this.displayModal2 = true;
    }
  }

  showDialog() {
    this.displayModal = true;
  }

  hideDialog() {
    this.displayModal = false;

  }

  hideDialog2() {
    this.displayModal2 = false;
  }

}
