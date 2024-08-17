import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustommerServiceComponent } from './custommer-service.component';

describe('CustommerServiceComponent', () => {
  let component: CustommerServiceComponent;
  let fixture: ComponentFixture<CustommerServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustommerServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustommerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
