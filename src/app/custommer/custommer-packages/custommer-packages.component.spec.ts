import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustommerPackagesComponent } from './custommer-packages.component';

describe('CustommerPackagesComponent', () => {
  let component: CustommerPackagesComponent;
  let fixture: ComponentFixture<CustommerPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustommerPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustommerPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
