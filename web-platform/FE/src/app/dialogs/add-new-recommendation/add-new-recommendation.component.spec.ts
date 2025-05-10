import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRecommendationComponent } from './add-new-recommendation.component';

describe('AddNewRecommendationComponent', () => {
  let component: AddNewRecommendationComponent;
  let fixture: ComponentFixture<AddNewRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewRecommendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
