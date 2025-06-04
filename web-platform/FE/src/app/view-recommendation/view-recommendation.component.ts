import { Component, OnInit, signal } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../interfaces/patient';
import { PatientService } from '../services/patient.service';
import { Recommendation } from '../interfaces/recommendation';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

// ✅ Angular Material modules (corect)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './view-recommendation.component.html',
  styleUrls: ['./view-recommendation.component.css'] // ✅ corectat din `styleUrl`
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

  editForm: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    public fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      activityType: ['', Validators.required],
      dailyDuration: [null, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: [''],
      additionalNotes: ['']
    });
  }

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

  get latestRecommendation(): Recommendation | null {
    if (this.recommendations.length === 0) return null;

    return [...this.recommendations]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
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
      // this.patientService.updatePatient(this.patient);
      this.recommendationForm.reset();
    }
  }

  enableEdit(): void {
    const latest = this.latestRecommendation;
    if (!latest) return;

    this.editForm.setValue({
      activityType: latest.activityType,
      dailyDuration: latest.dailyDuration,
      startDate: this.formatDate(latest.startDate),
      endDate: latest.endDate ? this.formatDate(latest.endDate) : '',
      additionalNotes: latest.additionalNotes || ''
    });

    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.latestRecommendation) return;

    const updated = this.editForm.value;
    const index = this.recommendations.indexOf(this.latestRecommendation);

    if (index !== -1) {
      const updatedRecommendation: Recommendation = {
        ...this.latestRecommendation,
        ...updated,
        startDate: new Date(updated.startDate),
        endDate: updated.endDate ? new Date(updated.endDate) : undefined
      };

      this.recommendations[index] = updatedRecommendation;
      // this.patientService.updatePatient(this.patient);
      this.isEditing = false;
    }
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
