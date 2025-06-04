import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEHRComponent } from './view-ehr.component';

describe('ViewEHRComponent', () => {
  let component: ViewEHRComponent;
  let fixture: ComponentFixture<ViewEHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEHRComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
