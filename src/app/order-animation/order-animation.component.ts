import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-animation',
  templateUrl: './order-animation.component.html',
  styleUrls: ['./order-animation.component.css']
})
export class OrderAnimationComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
    // Redirect after 3 seconds
    setTimeout(() => {
      this.router.navigate(['custommer/History']); // Adjust the route to your home component
    }, 6000);
  }

}
