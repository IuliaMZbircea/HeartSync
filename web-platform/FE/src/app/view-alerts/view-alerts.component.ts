import {Component, OnInit} from '@angular/core';
import {Patient} from "../../shared/interfaces/patient";
import {Alarm} from "../../shared/interfaces/alarm";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../../services/patient.service";
import {
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from "@angular/material/expansion";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-view-alerts',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    ReactiveFormsModule,
    NgIf,
    MatButton,
    NgForOf,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './view-alerts.component.html',
  styleUrl: './view-alerts.component.css'
})
export class ViewAlertsComponent implements OnInit {
  patient!: Patient;
  alarms: Alarm[] = [];
  alarmForm: FormGroup;
  editForm: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.alarmForm = this.fb.group({
      parameter: ['', Validators.required],
      condition: ['', Validators.required],
      threshold: [null, [Validators.required, Validators.min(0)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      afterActivity: ['false', Validators.required],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.editForm = this.fb.group({
      parameter: ['', Validators.required],
      condition: ['', Validators.required],
      threshold: [null, [Validators.required, Validators.min(0)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      afterActivity: ['false', Validators.required],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatientById(id).subscribe((patient: Patient) => {
        if (patient) {
          this.patient = patient;
          this.alarms = (patient.alarms || []).map(alarm => ({...alarm}));
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    }
  }

  get activeAlarms(): Alarm[] {
    return this.alarms.filter(a => a.isActive);
  }

  get inactiveAlarms(): Alarm[] {
    return this.alarms.filter(a => !a.isActive);
  }

  toggleActive(alarm: Alarm): void {
    alarm.isActive = false;
  }

  get latestAlarm(): Alarm | null {
    return this.alarms.length > 0 ? this.alarms[this.alarms.length - 1] : null;
  }

  onSubmit(): void {
    if (this.alarmForm.invalid || !this.patient?.id) return;

    const formValue = this.alarmForm.value;

    const alarmPayload = {
      patient_id: this.patient.id,
      parameter: formValue.parameter,
      conditionType: formValue.condition,
      threshold: formValue.threshold,
      duration: formValue.duration,
      afterActivity: formValue.afterActivity === 'true',
      message: formValue.message,
      isActive: true
    };

    this.alertService.createAlarm(alarmPayload).subscribe({
      next: (response) => {
        this.alarms.push(response);
        this.alarmForm.reset();
        this.alertService.success('Alarmă adăugată cu succes!');
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Eroare la salvarea alarmei.');
      }
    });
  }

  enableEdit(): void {
    const latest = this.latestAlarm;
    if (!latest) return;

    this.editForm.setValue({
      parameter: latest.parameter,
      condition: latest.condition,
      threshold: latest.threshold,
      duration: latest.duration,
      afterActivity: latest.afterActivity ? 'true' : 'false',
      message: latest.message
    });

    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.latestAlarm) return;

    const updated = this.editForm.value;
    const index = this.alarms.indexOf(this.latestAlarm);

    const updatedAlarm: Alarm = {
      ...this.latestAlarm,
      ...updated,
      afterActivity: updated.afterActivity === 'true',
    };

    if (index !== -1) {
      this.alarms[index] = updatedAlarm;
      this.patient.alarms = this.alarms;
    }

    this.isEditing = false;
  }
}
