import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationFormComponent } from './station-form.component';

describe('StationFormComponent', () => {
  let component: StationFormComponent;
  let fixture: ComponentFixture<StationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationFormComponent]
    });
    fixture = TestBed.createComponent(StationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
