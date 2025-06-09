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
import {AllergyService} from "../../services/allergies.service";

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
  providers: [AlertService, AllergyService
  ],
  templateUrl: './view-allergies.component.html',
  styleUrl: './view-allergies.component.css'
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
      active: [true],
      recordedDate: ['']
    });

    this.newAllergyForm = this.fb.group({
      name: ['', Validators.required],
      severity: ['', Validators.required],
      reaction: ['', Validators.maxLength(200)],
      notes: ['', Validators.maxLength(500)],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    // if (id !== null) {
    //   this.patientService.getPatientById(id).subscribe(patient => {
    //     this.patient = patient;
    //     this.loadAllergies();
    //   }, error => {
    //     this.alertService.error('Pacientul nu a fost găsit.');
    //   });
    // }
  }

  loadAllergies() {
    // this.allergyService.getAllergiesByPatient(this.patient.id).subscribe(allergies => {
    //   this.allergies = allergies;
    // }, error => {
    //   this.alertService.error('Eroare la încărcarea alergiilor.');
    // });
  }

  enableEditAllergies(allergy: Allergy) {
    this.isEditingAllergies = true;
    this.editAllergy = allergy;
    this.allergiesForm.patchValue({
      name: allergy.name,
      severity: allergy.severity,
      reaction: allergy.reaction,
      notes: allergy.notes,
      active: allergy.active,
      recordedDate: allergy.recordedDate ? new Date(allergy.recordedDate) : null,
    });
  }

  saveAllergies() {
    if (this.allergiesForm.valid && this.editAllergy) {
      const updatedAllergy = {
        ...this.allergiesForm.value,
        recordedDate: this.allergiesForm.value.recordedDate ? new Date(this.allergiesForm.value.recordedDate).toISOString().split('T')[0] : null
      };
      this.allergyService.updateAllergy(this.editAllergy.id!, updatedAllergy).subscribe(() => {
        this.alertService.success('Alergia a fost actualizată cu succes!');
        this.isEditingAllergies = false;
        this.loadAllergies();
      }, () => {
        this.alertService.error('Eroare la actualizarea alergiei.');
      });
    } else {
      this.alertService.error('Completează toate câmpurile obligatorii corect.');
    }
  }

  submitNewAllergy() {
    if (this.newAllergyForm.valid) {
      const newAllergyPayload = {
        ...this.newAllergyForm.value,
        patient_id: this.patient.id,
        recordedDate: new Date().toISOString().split('T')[0]
      };
      this.allergyService.createAllergy(newAllergyPayload).subscribe(() => {
        this.alertService.success('Alergia nouă a fost adăugată!');
        this.newAllergyForm.reset();
        this.loadAllergies();
      }, () => {
        this.alertService.error('Eroare la adăugarea alergiei.');
      });
    } else {
      this.alertService.error('Completează toate câmpurile obligatorii corect.');
    }
  }

  get activeAllergies(): Allergy[] {
    return this.allergies.filter(a => a.active);
  }

}
