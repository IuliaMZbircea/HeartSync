import {Component, OnInit} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import {Patient} from "../interfaces/patient";
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../services/patient.service";
import {Allergy} from "../interfaces/allergies";

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
    DatePipe
  ],
  templateUrl: './view-allergies.component.html',
  styleUrl: './view-allergies.component.css'
})
export class ViewAllergiesComponent implements  OnInit {


  allergies :Allergy [] = [];
  isEditingAllergies = false;

  allergiesForm: FormGroup = this.fb.group({
    allergies: this.fb.array([])
  });
  newAllergyForm: FormGroup = this.fb.group({
    allergies: this.fb.array([])
  });
  allergiesHistory: any;
  patient!: Patient;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private patientService: PatientService,) {
    this.initAllergiesForm();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find((p) => p.id === id);
        if (found) {
          this.patient = found;
          if (found) {
            this.patient = found;
            if (Array.isArray(found.allergies)) {
              this.allergies = found.allergies;
            } else if (found.allergies) {
              this.allergies = [found.allergies];
            } else {
              this.allergies = [];
            }
          }        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }
  initAllergiesForm() {
    this.allergiesForm = this.fb.group({
      allergies: this.fb.array(this.allergies.map(allergy => this.fb.group({
        name: [allergy.name, Validators.required],
        severity: [allergy.severity || ''],
        reaction: [allergy.reaction || ''],
        notes: [allergy.notes || '']
      })))
    });
  }

  get allergiesArray() {
    return this.allergiesForm.get('allergies') as FormArray;
  }

  enableEditAllergies() {
    this.isEditingAllergies = true;
    this.initAllergiesForm();
  }

  addAllergy() {
    this.allergiesArray.push(this.fb.group({
      name: ['', Validators.required],
      severity: [''],
      reaction: [''],
      notes: ['']
    }));
  }

  removeAllergy(index: number) {
    this.allergiesArray.removeAt(index);
  }

  saveAllergies() {
    if (this.allergiesForm.valid) {
      this.allergies = this.allergiesForm.value.allergies;
      this.isEditingAllergies = false;
    }
  }

  cancelEditAllergies() {
    this.isEditingAllergies = false;
  }

  addNewAllergy() {

  }
}
