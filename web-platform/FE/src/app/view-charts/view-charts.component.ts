import {Component, OnInit} from '@angular/core';
import {Patient} from "../interfaces/patient";
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../services/patient.service";

@Component({
  selector: 'app-view-charts',
  standalone: true,
  imports: [],
  templateUrl: './view-charts.component.html',
  styleUrl: './view-charts.component.css'
})
export class ViewChartsComponent implements OnInit {

  patient!: Patient;
  patientHistory!: Object;
  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find(p => p.id === id);
        if (found) {
          this.patient = found;
          this.patientHistory = found.patientHistory || [];
          console.log(this.patientHistory);
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }
}
