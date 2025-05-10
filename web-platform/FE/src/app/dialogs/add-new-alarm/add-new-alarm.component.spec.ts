import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAlarmComponent } from './add-new-alarm.component';

describe('AddNewAlarmComponent', () => {
  let component: AddNewAlarmComponent;
  let fixture: ComponentFixture<AddNewAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewAlarmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
