import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEmployeesComponent } from './vehicle-employees.component';

describe('VehicleEmployeesComponent', () => {
  let component: VehicleEmployeesComponent;
  let fixture: ComponentFixture<VehicleEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleEmployeesComponent]
    });
    fixture = TestBed.createComponent(VehicleEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
