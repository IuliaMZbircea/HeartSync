import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ViewEMRComponent} from "./view-emr.component";


describe('ViewEMRComponent', () => {
  let component: ViewEMRComponent;
  let fixture: ComponentFixture<ViewEMRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEMRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEMRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
