import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRefferalComponent } from './audit-refferal.component';

describe('AuditRefferalComponent', () => {
  let component: AuditRefferalComponent;
  let fixture: ComponentFixture<AuditRefferalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditRefferalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuditRefferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
