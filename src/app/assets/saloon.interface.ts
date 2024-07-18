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
