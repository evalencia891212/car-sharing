import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEmissionsComponent } from './real-emissions.component';

describe('RealEmissionsComponent', () => {
  let component: RealEmissionsComponent;
  let fixture: ComponentFixture<RealEmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealEmissionsComponent]
    });
    fixture = TestBed.createComponent(RealEmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
