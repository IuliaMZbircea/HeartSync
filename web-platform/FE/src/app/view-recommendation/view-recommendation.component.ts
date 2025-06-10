import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../shared/interfaces/patient';
import { PatientService } from '../../services/patient.service';
import { RecommendationService } from '../../services/recommendation.service';
import { AlertService } from '../../services/alert.service';
import { Recommendation } from "../../shared/interfaces/recommendation";
import {MatExpansionModule} from "@angular/material/expansion";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-view-recommendation',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    MatButton,
    MatIconButton,
  ],
  templateUrl: './view-recommendation.component.html',
  styleUrls: ['./view-recommendation.component.css']
})
export class ViewRecommendationComponent implements OnInit {
  readonly panelOpenState = signal(false);
  patient!: Patient;

  recommendationsEnded: Recommendation[] = [];
  allRecommendations: Recommendation[] = [];

  recommendationForm = this.fb.group({
    activityType: ['', Validators.required],
    dailyDuration: [null, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: [''],
    additionalNotes: ['']
  });

  editForm: FormGroup;
  isEditing = false;
  editingRecommendation: Recommendation | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private recommendationService: RecommendationService,
    public fb: FormBuilder,
    private alertService: AlertService
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
        const found = patients.find(p => p.id === id);
        if (found) {
          this.patient = found;
          this.refreshRecommendations();
        } else {
          this.alertService.error('The patient ID is invalid or missing from the URL.');
        }
      });
    }
  }

  refreshRecommendations() {
    if (!this.patient?.id) return;

    this.recommendationService.getRecommendationsByPatient(this.patient.id).subscribe({
      next: (recs: Recommendation[]) => {
        const today = new Date();

        this.recommendationsEnded = recs.filter(rec => {
          if (!rec.endDate) return false;
          const endDate = new Date(rec.endDate);

          return endDate > today;
        });

        this.allRecommendations = recs;
      },
      error: () => {
        this.alertService.error('Error loading recommendations.');
      }
    });
  }

  onSubmit(): void {
    if (this.recommendationForm.invalid) return;

    const formValue = this.recommendationForm.value;

    const newRecommendation: Partial<Recommendation> & { patient: number } = {
      patient: this.patient.id!,
      activityType: formValue.activityType!,
      dailyDuration: formValue.dailyDuration!,
      startDate: formValue.startDate!,
      endDate: formValue.endDate || undefined,
      additionalNotes: formValue.additionalNotes || '',
      isActive: true
    };

    this.recommendationService.createRecommendation(newRecommendation).subscribe({
      next: () => {
        this.alertService.success('The recommendation has been successfully added!');
        this.recommendationForm.reset();
        this.refreshRecommendations();
      },
      error: () => {
        this.alertService.error('Error adding the recommendation.');
      }
    });
  }

  enableEdit(rec: Recommendation): void {
    this.editingRecommendation = rec;
    const normalizedActivityType = rec.activityType?.toLowerCase() || '';

    this.editForm.setValue({
      activityType: normalizedActivityType,
      dailyDuration: rec.dailyDuration,
      startDate: this.formatDate(rec.startDate),
      endDate: rec.endDate ? this.formatDate(rec.endDate) : '',
      additionalNotes: rec.additionalNotes || ''
    });

    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.editingRecommendation) return;

    const updated = this.editForm.value;
    const id = this.editingRecommendation.id;

    const updatedRecommendation: Partial<Recommendation> = {
      activityType: updated.activityType,
      dailyDuration: updated.dailyDuration,
      startDate: updated.startDate,
      endDate: updated.endDate || undefined,
      additionalNotes: updated.additionalNotes
    };

    this.recommendationService.updateRecommendation(id, updatedRecommendation).subscribe({
      next: () => {
        this.alertService.success('The recommendation has been successfully updated!');
        this.isEditing = false;
        this.editingRecommendation = null;

        this.refreshRecommendations();
      },
      error: () => {
        this.alertService.error('Error updating the recommendation.');
      }
    });
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
