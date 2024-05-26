import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalFuelComponent } from './global-fuel.component';

describe('GlobalFuelComponent', () => {
  let component: GlobalFuelComponent;
  let fixture: ComponentFixture<GlobalFuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalFuelComponent]
    });
    fixture = TestBed.createComponent(GlobalFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
