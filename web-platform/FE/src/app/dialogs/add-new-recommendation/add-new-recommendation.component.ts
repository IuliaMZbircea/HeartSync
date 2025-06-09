import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {PatientService} from "../../../services/patient.service";
import {Patient} from "../../../shared/interfaces/patient";

@Component({
  selector: 'app-add-new-recommendation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    NgIf,
    MatButtonToggle,
    MatButtonToggleGroup,
    FormsModule,
    DatePipe,
    NgForOf,
  ],
  templateUrl: './add-new-recommendation.component.html',
  styleUrl: './add-new-recommendation.component.css'
})
export class AddNewRecommendationComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddNewRecommendationComponent>,
              public fb:FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { id: string },
              private patientService: PatientService){}

  recommendationForm = this.fb.group({
    activityType: ['', Validators.required],
    dailyDuration: [null, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: [''],
    additionalNotes: ['']
  });

  selectedOption: string | undefined = 'add';
  patient!: Patient;
  recommendations: any[] = [];

  onToggleChange(event: any): void {
    console.log('Selected:', event.value);
    this.selectedOption = event.value;
  }

  onSubmit() {
    if (this.recommendationForm.valid) {
      const data = this.recommendationForm.value;
      this.dialogRef.close(data);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.patientService.getPatients().subscribe(patients => {
      const found = patients.find(p => p.cnp === this.data.id);
      if (found) {
        this.patient = found;
        this.recommendations = found.recommendations;
      }
    });
  }
}
