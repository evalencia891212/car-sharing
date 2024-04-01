import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatRoutesComponent } from './cat-routes.component';

describe('CatRoutesComponent', () => {
  let component: CatRoutesComponent;
  let fixture: ComponentFixture<CatRoutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatRoutesComponent]
    });
    fixture = TestBed.createComponent(CatRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
