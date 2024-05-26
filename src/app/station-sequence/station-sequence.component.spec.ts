import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSequenceComponent } from './station-sequence.component';

describe('StationSequenceComponent', () => {
  let component: StationSequenceComponent;
  let fixture: ComponentFixture<StationSequenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationSequenceComponent]
    });
    fixture = TestBed.createComponent(StationSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
