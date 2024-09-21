// shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private buttonClickedSource = new Subject<void>();
  buttonClicked$ = this.buttonClickedSource.asObservable();

  triggerButtonClick() {
    this.buttonClickedSource.next();
  }
}
