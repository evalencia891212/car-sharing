import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingCarComponent } from './waiting-car.component';

describe('WaitingCarComponent', () => {
  let component: WaitingCarComponent;
  let fixture: ComponentFixture<WaitingCarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingCarComponent]
    });
    fixture = TestBed.createComponent(WaitingCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
