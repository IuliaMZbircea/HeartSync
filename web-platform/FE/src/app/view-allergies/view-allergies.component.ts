import { Component, OnInit } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import { DatePipe, NgForOf, NgIf, TitleCasePipe } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Patient } from "../../shared/interfaces/patient";
import { ActivatedRoute } from "@angular/router";
import { PatientService } from "../../services/patient.service";
import { Allergy } from "../../shared/interfaces/allergies";
import { AlertService } from "../../services/alert.service";
import { AllergyService } from "../../services/allergies.service";

@Component({
  selector: 'app-view-allergies',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    MatExpansionModule,
    TitleCasePipe,
    DatePipe,
    MatIconButton
  ],
  providers: [AlertService, AllergyService],
  templateUrl: './view-allergies.component.html',
  styleUrls: ['./view-allergies.component.css']
})
export class ViewAllergiesComponent implements OnInit {

  allergies: Allergy[] = [];
  isEditingAllergies = false;
  patient!: Patient;
  editAllergy!: Allergy;

  allergiesForm: FormGroup;
  newAllergyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private allergyService: AllergyService,
    private alertService: AlertService
  ) {
    this.allergiesForm = this.fb.group({
      name: ['', Validators.required],
      severity: ['', Validators.required],
      reaction: ['', Validators.maxLength(200)],
      notes: ['', Validators.maxLength(500)],
      isActive: [true],
      recordedDate: ['']
    });

    this.newAllergyForm = this.fb.group({
      name: ['', Validators.required],
      severity: ['', Validators.required],
      reaction: ['', Validators.maxLength(200)],
      notes: ['', Validators.maxLength(500)],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatientById(id).subscribe({
        next: patient => {
          this.patient = patient;
          this.loadAllergies();
        },
        error: () => {
          this.alertService.error('Patient not found.');
        }
      });
    }
  }

  loadAllergies() {
    this.allergyService.getAllergiesByPatient(this.patient.id).subscribe({
      next: allergies => {
        this.allergies = allergies;
      },
      error: () => {
        this.alertService.error('Error loading allergies.');
      }
    });
  }

  enableEditAllergies(allergy: Allergy) {
    this.isEditingAllergies = true;
    this.editAllergy = allergy;
    this.allergiesForm.patchValue({
      name: allergy.name,
      severity: allergy.severity,
      reaction: allergy.reaction,
      notes: allergy.notes,
      isActive: allergy.isActive,
      recordedDate: allergy.recordedDate ? new Date(allergy.recordedDate) : null,
    });
  }

  saveAllergies() {
    if (this.allergiesForm.valid && this.editAllergy) {
      const updatedAllergy = {
        ...this.allergiesForm.value,
        recordedDate: this.allergiesForm.value.recordedDate
          ? new Date(this.allergiesForm.value.recordedDate).toISOString().split('T')[0]
          : null
      };

      this.allergyService.updateAllergy(this.editAllergy.id!, updatedAllergy).subscribe({
        next: () => {
          this.alertService.success('Allergy updated successfully!');
          this.isEditingAllergies = false;
          this.loadAllergies();
        },
        error: () => {
          this.alertService.error('Error updating allergy.');
        }
      });
    } else {
      this.alertService.error('Please fill in all required fields correctly.');
    }
  }

  submitNewAllergy() {
    if (this.newAllergyForm.valid) {
      const newAllergyPayload = {
        ...this.newAllergyForm.value,
        patient_id: this.patient.id,
        recordedDate: new Date().toISOString().split('T')[0]
      };

      this.allergyService.createAllergy(newAllergyPayload).subscribe({
        next: () => {
          this.alertService.success('New allergy added!');
          this.newAllergyForm.reset();
          this.loadAllergies();
        },
        error: () => {
          this.alertService.error('Error adding allergy.');
        }
      });
    } else {
      this.alertService.error('Please fill in all required fields correctly.');
    }
  }

  get activeAllergies(): Allergy[] {
    return this.allergies.filter(a => a.isActive);
  }
}
