import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRecommendationComponent } from './audit-recommendation.component';

describe('AuditRecommendationComponent', () => {
  let component: AuditRecommendationComponent;
  let fixture: ComponentFixture<AuditRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditRecommendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
