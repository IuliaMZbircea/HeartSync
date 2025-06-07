import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChartsComponent } from './view-charts.component';

describe('ViewChartsComponent', () => {
  let component: ViewChartsComponent;
  let fixture: ComponentFixture<ViewChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
