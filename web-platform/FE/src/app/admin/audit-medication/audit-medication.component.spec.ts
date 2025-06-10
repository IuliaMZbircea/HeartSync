import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditMedicationComponent } from './audit-medication.component';

describe('AuditMedicationComponent', () => {
  let component: AuditMedicationComponent;
  let fixture: ComponentFixture<AuditMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditMedicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
