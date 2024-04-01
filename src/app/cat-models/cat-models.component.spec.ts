import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatModelsComponent } from './cat-models.component';

describe('CatModelsComponent', () => {
  let component: CatModelsComponent;
  let fixture: ComponentFixture<CatModelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatModelsComponent]
    });
    fixture = TestBed.createComponent(CatModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
