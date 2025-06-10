import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPatientComponent } from './audit-patient.component';

describe('AuditPatientComponent', () => {
  let component: AuditPatientComponent;
  let fixture: ComponentFixture<AuditPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
