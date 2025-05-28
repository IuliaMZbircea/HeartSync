import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Patient} from "../../interfaces/patient";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {PatientService} from "../../services/patient.service";

@Component({
  selector: 'app-patient-file',
  standalone: true,
  imports: [
    MatDivider,
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './patient-file.component.html',
  styleUrl: './patient-file.component.css'
})
export class PatientFileComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PatientFileComponent>,
              private patientService: PatientService,
              @Inject(MAT_DIALOG_DATA) public data: { id: string }) {}

  @Input() patient!: Patient;
  @Input() alarms: Patient[] = [];

  ngOnInit() {
    this.patientService.getPatients().subscribe(patients => {
      const found = patients.find(p => p.cnp === this.data.id);
      if (found) {
        this.patient = found;
      }
      console.log(this.patient)
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
