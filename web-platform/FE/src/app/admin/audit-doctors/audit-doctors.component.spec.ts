import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditDoctorsComponent } from './audit-doctors.component';

describe('AuditDoctorsComponent', () => {
  let component: AuditDoctorsComponent;
  let fixture: ComponentFixture<AuditDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditDoctorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
