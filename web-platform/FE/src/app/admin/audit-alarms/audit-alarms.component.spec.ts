import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditAlarmsComponent } from './audit-alarms.component';

describe('AuditAlarmsComponent', () => {
  let component: AuditAlarmsComponent;
  let fixture: ComponentFixture<AuditAlarmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditAlarmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditAlarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
