import {Component, OnInit, signal} from '@angular/core';
import {Patient} from "../interfaces/patient";
import {Alarm} from "../interfaces/alarm";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../services/patient.service";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from "@angular/material/expansion";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

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
  readonly panelOpenState = signal(false);
  patient!: Patient;
  alarms: Alarm[] = [];
  alarmForm: FormGroup;
  editForm: FormGroup;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder
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
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find(p => p.id === id);
        if (found) {
          this.patient = found;
          // Asigură că fiecare alarmă are proprietatea read, implicit false
          this.alarms = (found.alarms || []).map(alarm => ({
            ...alarm,
            read: alarm.read ?? false
          }));
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }

  toggleRead(alarm: Alarm) {
    alarm.read = !alarm.read;
  }

  get latestAlarm(): Alarm | null {
    return this.alarms.length > 0 ? this.alarms[this.alarms.length - 1] : null;
  }

  onSubmit(): void {
    if (this.alarmForm.valid) {
      const formValue = this.alarmForm.value;

      const newAlarm: Alarm = {
        parameter: formValue.parameter,
        condition: formValue.condition,
        threshold: formValue.threshold,
        duration: formValue.duration,
        afterActivity: formValue.afterActivity === 'true',
        message: formValue.message,
        read: false // implicit necitită la adăugare
      };

      this.alarms.push(newAlarm);
      this.patient.alarms = this.alarms;
      this.patientService.updatePatient(this.patient);
      this.alarmForm.reset();
    }
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
      read: this.latestAlarm.read // păstrează starea de citit/necitit
    };

    if (index !== -1) {
      this.alarms[index] = updatedAlarm;
      this.patient.alarms = this.alarms;
      this.patientService.updatePatient(this.patient);
    }

    this.isEditing = false;
  }
}
