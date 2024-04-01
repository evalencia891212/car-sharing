import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatVehiclesComponent } from './cat-vehicles.component';

describe('CatVehiclesComponent', () => {
  let component: CatVehiclesComponent;
  let fixture: ComponentFixture<CatVehiclesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatVehiclesComponent]
    });
    fixture = TestBed.createComponent(CatVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
