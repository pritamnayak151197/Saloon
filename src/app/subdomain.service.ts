import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubdomainService {

  private subdomain: string = '';

  constructor() { }

  // Method to extract subdomain
  extractSubdomain(): string {
    const host = window.location.hostname;
    const subdomain = host.split('.')[0]; // Extracts 'salon' from 'salon.salontheart.com'
    this.subdomain = subdomain;
    return this.subdomain;
  }

  // Method to get the subdomain
  getSubdomain(): string {
    return this.subdomain;
  }
}
