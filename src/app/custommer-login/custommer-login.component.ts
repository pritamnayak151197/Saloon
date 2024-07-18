import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './custommer-login.component.html',
  styleUrls: ['./custommer-login.component.css'],
  providers: [MessageService]
})
export class CustommerLoginComponent implements OnInit {

  constructor(private fb: FormBuilder
  ) { }

  salonForm!: FormGroup;
  
  ngOnInit(): void {
    this.salonForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      startDate: ['', Validators.required],
      birthDate: [, [Validators.required, Validators.min(1), Validators.max(31)]],
      birthMonth: [, [Validators.required, Validators.min(1), Validators.max(12)]],
      gender: [, Validators.required],
      type: ['', Validators.required],
      prefix: ['', Validators.required],
      salonId: [, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.salonForm.valid) {
      console.log(this.salonForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

}
  


