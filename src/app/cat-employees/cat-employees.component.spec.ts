import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatEmployeesComponent } from './cat-employees.component';

describe('CatEmployeesComponent', () => {
  let component: CatEmployeesComponent;
  let fixture: ComponentFixture<CatEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatEmployeesComponent]
    });
    fixture = TestBed.createComponent(CatEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
