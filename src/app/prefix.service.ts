// prefix.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
export class PrefixService {
  private readonly prefix: string = 'krati'; // Replace with your prefix

  constructor() { }

  getPrefix(): string {
    return this.prefix;
  }
}
