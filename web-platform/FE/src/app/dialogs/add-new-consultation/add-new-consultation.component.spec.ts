import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewConsultationComponent } from './add-new-consultation.component';

describe('AddNewConsultationComponent', () => {
  let component: AddNewConsultationComponent;
  let fixture: ComponentFixture<AddNewConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewConsultationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
