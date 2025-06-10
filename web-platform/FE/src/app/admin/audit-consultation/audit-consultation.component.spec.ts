import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditConsultationComponent } from './audit-consultation.component';

describe('AuditConsultationComponent', () => {
  let component: AuditConsultationComponent;
  let fixture: ComponentFixture<AuditConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditConsultationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
