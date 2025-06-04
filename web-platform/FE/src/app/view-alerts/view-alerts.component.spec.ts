import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlertsComponent } from './view-alerts.component';

describe('ViewAlertsComponent', () => {
  let component: ViewAlertsComponent;
  let fixture: ComponentFixture<ViewAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAlertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
