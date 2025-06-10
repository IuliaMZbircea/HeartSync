import {Component, OnInit} from '@angular/core';
import {Patient} from "../../shared/interfaces/patient";
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
  alarms: any[] = [];
  alarmForm: FormGroup;
  editForm: FormGroup;
  isEditing = false;
  editingAlarmIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.alarmForm = this.fb.group({
      parameter: ['', Validators.required],
      minValue: [null, [Validators.required, Validators.min(0)]],
      maxValue: [null, [Validators.required, Validators.min(0)]],
      durationMinutes: [null, [Validators.required, Validators.min(1)]],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.editForm = this.fb.group({
      parameter: ['', Validators.required],
      minValue: [null, [Validators.required, Validators.min(0)]],
      maxValue: [null, [Validators.required, Validators.min(0)]],
      durationMinutes: [null, [Validators.required, Validators.min(1)]],
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
          this.alarms = (patient.sensorAlertThresholds || []).map(alarm => ({...alarm}));
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    }
  }

  get activeAlarms(): any[] {
    return this.alarms.filter(a => a.isActive);
  }

  get inactiveAlarms(): any[] {
    return this.alarms.filter(a => !a.isActive);
  }

  onSubmit(): void {
    if (this.alarmForm.invalid || !this.patient?.id) return;

    const formValue = this.alarmForm.value;

    const alarmPayload = {
      patient_id: this.patient.id,
      parameter: formValue.parameter,
      minValue: formValue.minValue,
      maxValue: formValue.maxValue,
      durationMinutes: formValue.durationMinutes,
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

  enableEdit(index: number): void {
    const alarm = this.activeAlarms[index];
    if (!alarm) return;

    this.editForm.setValue({
      parameter: alarm.parameter,
      minValue: alarm.minValue,
      maxValue: alarm.maxValue,
      durationMinutes: alarm.durationMinutes,
      message: alarm.message
    });

    this.editingAlarmIndex = index;
  }

  saveEdit(): void {
    if (this.editForm.invalid || this.editingAlarmIndex === null) return;

    const updated = this.editForm.value;
    const alarm = this.activeAlarms[this.editingAlarmIndex];

    const updatedAlarm: any = {
      ...alarm,
      ...updated
    };

    if (!alarm.id) {
      console.error('Alarm does not have an ID.');
      return;
    }

    this.alertService.updateAlarm(alarm.id, updatedAlarm).subscribe({
      next: (response) => {
        const globalIndex = this.alarms.indexOf(alarm);
        if (globalIndex !== -1) {
          this.alarms[globalIndex] = response;
        }
        this.alertService.success('Alarm updated successfully!');
        this.editingAlarmIndex = null;
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to update the alarm.');
      }
    });
  }

}
