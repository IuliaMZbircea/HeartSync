import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {Patient} from "../interfaces/patient";
import {PatientService} from "../services/patient.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-emr',
  standalone: true,
    imports: [
        DatePipe,
        MatDivider,
        NgForOf,
        NgIf
    ],
  templateUrl: './view-emr.component.html',
  styleUrl: './view-emr.component.css'
})
export class ViewEMRComponent implements OnInit {

  patient!:Patient;

  constructor(private patientService:PatientService,private route: ActivatedRoute,){}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find(p => p.id === id);
        if (found) {
          this.patient = found;
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
}
}
