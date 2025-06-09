import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../services/patient.service";
import {Patient} from "../interfaces/patient";

@Component({
  selector: 'app-view-consultations',
  standalone: true,
  imports: [],
  templateUrl: './view-consultations.component.html',
  styleUrl: './view-consultations.component.css'
})
export class ViewConsultationsComponent implements OnInit {
  patientId?: string;
  patients: Patient[] = [];

  constructor(private route: ActivatedRoute, private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? undefined;

    this.patientService.getPatientsFromController().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => console.error('Error fetching patients', err)
    });
  }
}
