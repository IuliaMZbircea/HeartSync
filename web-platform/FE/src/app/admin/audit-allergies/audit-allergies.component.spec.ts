import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAllergiesComponent } from './audit-allergies.component';

describe('AuditAllergiesComponent', () => {
  let component: AuditAllergiesComponent;
  let fixture: ComponentFixture<AuditAllergiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditAllergiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
