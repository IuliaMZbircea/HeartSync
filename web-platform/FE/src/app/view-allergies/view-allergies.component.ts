import {Component, OnInit} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import {Patient} from "../../shared/interfaces/patient";
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../../services/patient.service";
import {Allergy} from "../../shared/interfaces/allergies";
import {AlertService} from "../../services/alert.service";

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
  providers: [AlertService],
  templateUrl: './view-allergies.component.html',
  styleUrl: './view-allergies.component.css'
})
export class ViewAllergiesComponent implements  OnInit {
  allergies :Allergy [] = [];
  isEditingAllergies = false;
  patient!: Patient;
  editAllergy!: Allergy;

  allergiesForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    severity: ['', Validators.required],
    reaction: ['', Validators.maxLength(200)],
    notes: ['', Validators.maxLength(500)]
  });

  newAllergyForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    severity: ['', Validators.required],
    reaction: ['', Validators.maxLength(200)],
    notes: ['', Validators.maxLength(500)]
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private patientService: PatientService,  private alertService: AlertService  ) {
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find((p) => p.id === id);
        if (found) {
          this.patient = found;
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }

  enableEditAllergies(allergy: Allergy) {
    this.isEditingAllergies = true;
    this.editAllergy = allergy;

    this.allergiesForm = this.fb.group({
      name: [allergy.name, Validators.required],
      severity: [allergy.severity || ''],
      reaction: [allergy.reaction || ''],
      notes: [allergy.notes || ''],
      recordedDate: [allergy.recordedDate || new Date()],
      active: [allergy.active ?? true]
    });
  }

  get activeAllergies(): Allergy[] {
    return this.allergies.filter(a => a.active);
  }

  saveAllergies() {
    if (this.allergiesForm.valid && this.editAllergy) {
      const index = this.allergies.findIndex(a => a === this.editAllergy);

      if (index !== -1) {
        this.allergies[index] = {
          ...this.editAllergy,
          ...this.allergiesForm.value
        };
      }
      this.alertService.success('Allergy updated successfully!');

      this.isEditingAllergies = false;
      this.editAllergy = undefined!;
      this.allergiesForm.reset();
    }
    else {
      this.alertService.error('Please fill in the required fields correctly.');
    }
  }

  submitNewAllergy() {
    if (this.newAllergyForm.valid) {
      const newAllergy = {
        ...this.newAllergyForm.value,
        active: true,
        recordedDate: new Date()
      };

      this.allergies.push(newAllergy);
      this.patientService.updatePatient(this.patient);
      this.alertService.success('New allergy added successfully!');

      this.newAllergyForm.reset();
    }
    else {
      this.alertService.error('Please fill in the required fields correctly.');
    }
  }

}
