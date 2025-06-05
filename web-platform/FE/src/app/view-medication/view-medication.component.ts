import {Component, OnInit, signal} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Patient} from "../interfaces/patient";
import {Medication} from "../interfaces/medication";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../services/patient.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-view-medication',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatButton,
    MatIcon,
    MatIconButton,
    DatePipe
  ],
  templateUrl: './view-medication.component.html',
  styleUrl: './view-medication.component.css'
})
export class ViewMedicationComponent implements OnInit {

  readonly panelOpenState = signal(false);
  patient!: Patient;
  medications: Medication[] = [];
  editForm: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      route: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      prescribedBy: ['', Validators.required],
      notes: ['']
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
          this.medications = found.medications || [];
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }

  get latestMedication(): Medication | null {
    if (this.medications.length === 0) return null;
    return this.medications[this.medications.length - 1];
  }

  enableEdit(): void {
    const latest = this.latestMedication;
    if (!latest) return;

    this.editForm.setValue({
      name: latest.name,
      dose: latest.dose,
      frequency: latest.frequency,
      route: latest.route,
      startDate: this.formatDate(latest.startDate),
      endDate: latest.endDate ? this.formatDate(latest.endDate) : '',
      prescribedBy: latest.prescribedBy,
      notes: latest.notes || ''
    });

    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.latestMedication) return;

    const updated = this.editForm.value;
    const index = this.medications.indexOf(this.latestMedication);

    const updatedMedication: Medication = {
      ...this.latestMedication,
      ...updated,
      startDate: new Date(updated.startDate),
      endDate: updated.endDate ? new Date(updated.endDate) : undefined
    };

    if (index !== -1) {
      this.medications[index] = updatedMedication;
      this.patient.medications = this.medications;
      this.patientService.updatePatient(this.patient);
    }

    this.isEditing = false;
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

}
