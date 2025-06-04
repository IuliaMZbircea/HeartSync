import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisCodeComponent } from './diagnosis-code.component';

describe('DiagnosisCodeComponent', () => {
  let component: DiagnosisCodeComponent;
  let fixture: ComponentFixture<DiagnosisCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosisCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagnosisCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
