import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { AlertService } from '../../services/alert.service';
import { Doctor } from '../../shared/interfaces/doctor';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers:[ DoctorService],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
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
