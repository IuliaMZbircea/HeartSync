import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatDivider} from "@angular/material/divider";
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {Patient} from "../../shared/interfaces/patient";
import {PatientService} from "../../services/patient.service";
import {AlertService} from "../../services/alert.service";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-view-consultations',
  standalone: true,
  imports: [
    FormsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    ReactiveFormsModule,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    NgForOf,
    NgIf,
    MatIcon,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './view-consultations.component.html',
  styleUrl: './view-consultations.component.css'
})
export class ViewConsultationsComponent implements OnInit {
  patientId?: string;
  patient!: Patient;

  constructor(private route: ActivatedRoute, private patientService: PatientService,private alertService:AlertService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatientById(id).subscribe(patient => {
        this.patient = patient;
        console.log(patient)
      }, error => {
        this.alertService.error('Pacientul nu a fost găsit.');
      });
    }

  }
}
