export interface Salon {
    salonId: number;
    salonName: string;
    phone: string;
    address: string;
    addressUrl: string;
    salonLogo: string;
    registeredOn: number;
    subscriptionStartDate: number;
    subscriptionEndDate: number;
    status: boolean;
    qrCode: string;
    sms: boolean;
    coupon: boolean;
    membership: boolean;
    customer: Customer[];
    services: Service[];
    packageIds: number[];
}

export interface Customer {
    customerId: number;
    name: string;
    phone: string;
    email: string;
    startDate: number[];
    birthDate: number;
    birthMonth: number;
    gender: string;
    type: string;
    bookings: any[];
}

export interface Service {
    serviceId: number;
    serviceName: string;
    details: string;
    servicePic: string;
    price: number;
    discountPrice: number;
    status: boolean;
    serviceType: string;
}


export interface Package {
    packageId: number;
    packageName: string;
    packageLogo: string;  // Assuming packageLogo can be a URL or empty string
    price: number;
    discountPrice: number;
    startDate: [number, number, number]; // Representing [year, month, day]
    endDate: [number, number, number];   // Representing [year, month, day]
    status: boolean;
    services: number[]; // Array of service IDs
  }

  export interface Service {
    serviceId: number;
    serviceName: string;
    // Add any other properties that the service object might have
  }