import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Doctor} from "../../../shared/interfaces/doctor";
import {DoctorService} from "../../../services/doctor.service";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-doctors-list',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf
    ],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  searchTerm: string = '';

  get filteredDoctors() {
    if (!this.searchTerm.trim()) {
      return this.doctors;
    }
    const term = this.searchTerm.toLowerCase();
    return this.doctors.filter(d =>
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(term)
    );
  }

  constructor(
    private doctorService: DoctorService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: () => this.alertService.error('Error loading doctors.')
    });
  }
  deactivateDoctor(doctorId: number): void {
    this.doctorService.deactivateDoctor(doctorId).subscribe({
      next: () => {
        this.doctors = this.doctors.filter(d => d.id !== doctorId);
        this.alertService.success(`Doctor with ID ${doctorId} has been deleted.`);      },
      error: (err) => {
        this.alertService.error(`Error deleting doctor with ID ${doctorId}.`);
      }
    });
  }



}

