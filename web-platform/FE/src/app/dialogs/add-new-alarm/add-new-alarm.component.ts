import {Component, Inject, OnInit} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgForOf, NgIf} from "@angular/common";
import {PatientService} from "../../../services/patient.service";
import {Patient} from "../../../shared/interfaces/patient";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";

@Component({
  selector: 'app-add-new-alarm',
  standalone: true,
  imports: [
    MatDivider,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './add-new-alarm.component.html',
  styleUrl: './add-new-alarm.component.css'
})
export class AddNewAlarmComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<AddNewAlarmComponent>,
              public fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { id: string },
              private patientService: PatientService) {}

  alarmForm = this.fb.group({
    parameter: ['', Validators.required],
    condition: ['', Validators.required],
    threshold: [null, [Validators.required, Validators.min(0)]],
    duration: [null, [Validators.required, Validators.min(1)]],
    afterActivity: ['false', Validators.required],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  selectedOption: string = 'add';
  patient!: Patient;
  alarms: any[] = [];

  ngOnInit() {
    this.patientService.getPatients().subscribe(patients => {
      const found = patients.find(p => p.cnp === this.data.id);
      if (found) {
        this.patient = found;
        this.alarms = found.alarms || [];
      }
    });
  }

  onToggleChange(event: any): void {
    this.selectedOption = event.value;

  }

  onSubmit() {
    if (this.alarmForm.valid) {
      const data = this.alarmForm.value;
      this.dialogRef.close(data);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
