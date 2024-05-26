import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealFuelComponent } from './real-fuel.component';

describe('RealFuelComponent', () => {
  let component: RealFuelComponent;
  let fixture: ComponentFixture<RealFuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealFuelComponent]
    });
    fixture = TestBed.createComponent(RealFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
