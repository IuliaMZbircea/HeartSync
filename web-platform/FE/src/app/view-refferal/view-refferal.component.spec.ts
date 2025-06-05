import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRefferalComponent } from './view-refferal.component';

describe('ViewRefferalComponent', () => {
  let component: ViewRefferalComponent;
  let fixture: ComponentFixture<ViewRefferalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRefferalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRefferalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
