import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSaloonsComponent } from './manage-saloons.component';

describe('ManageSaloonsComponent', () => {
  let component: ManageSaloonsComponent;
  let fixture: ComponentFixture<ManageSaloonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSaloonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSaloonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
