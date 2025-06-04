import { Component, OnInit, signal } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../interfaces/patient';
import { PatientService } from '../services/patient.service';
import { Recommendation } from '../interfaces/recommendation';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-recommendation',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanelTitle,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    ReactiveFormsModule,
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './view-recommendation.component.html',
  styleUrl: './view-recommendation.component.css'
})
export class ViewRecommendationComponent implements OnInit {

  readonly panelOpenState = signal(false);
  patient!: Patient;
  recommendations: Recommendation[] = [];

  recommendationForm = this.fb.group({
    activityType: ['', Validators.required],
    dailyDuration: [null, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: [''],
    additionalNotes: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find((p) => p.id === id);
        if (found) {
          this.patient = found;
          this.recommendations = found.recommendations || [];
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }

  onSubmit(): void {
    if (this.recommendationForm.valid) {
      const formValue = this.recommendationForm.value;

      const newRecommendation: Recommendation = {
        activityType: formValue.activityType!,
        dailyDuration: formValue.dailyDuration!,
        startDate: new Date(formValue.startDate!),
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
        additionalNotes: formValue.additionalNotes || ''
      };

      this.recommendations.push(newRecommendation);
      this.recommendationForm.reset();
    }
  }
}
