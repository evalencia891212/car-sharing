import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalEmissionsComponent } from './global-emissions.component';

describe('GlobalEmissionsComponent', () => {
  let component: GlobalEmissionsComponent;
  let fixture: ComponentFixture<GlobalEmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalEmissionsComponent]
    });
    fixture = TestBed.createComponent(GlobalEmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
