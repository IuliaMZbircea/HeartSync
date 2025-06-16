import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Doctor} from "../../../shared/interfaces/doctor";
import {DoctorService} from "../../../services/doctor.service";
import {AlertService} from "../../../services/alert.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  searchTerm: string = '';

  editingDoctorId: number | null = null;
  editedRoles: string[] = [];

  availableRoles = ['ROLE_DOCTOR', 'ROLE_ADMIN'];
  private currentDoctorId!: number;

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
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit() {
      this.authService.getCurrentUser().subscribe({
        next: (currentDoctor) => {
          this.currentDoctorId = currentDoctor.id;
          this.loadDoctors();
        },
        error: () => {
          this.alertService.error('Eroare la încărcarea doctorului curent.');
          this.loadDoctors();
        }
      });
    }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        if (this.currentDoctorId !== null) {
          this.doctors = data.filter(d => d.id !== this.currentDoctorId);
        } else {
          this.doctors = data;
        }
      },
      error: () => this.alertService.error('Error loading doctors.')
    });
  }

  deactivateDoctor(doctorId: number): void {
    this.doctorService.deactivateDoctor(doctorId).subscribe({
      next: () => {
        this.doctors = this.doctors.filter(d => d.id !== doctorId);
        this.alertService.success(`Doctor with ID ${doctorId} has been deleted.`);
      },
      error: () => {
        this.alertService.error(`Error deleting doctor with ID ${doctorId}.`);
      }
    });
  }

  startEdit(doctor: Doctor): void {
    this.editingDoctorId = doctor.id;
    this.editedRoles = [...doctor.roles];
  }

  cancelEdit(): void {
    this.editingDoctorId = null;
    this.editedRoles = [];
  }

  saveRoles(doctor: Doctor): void {
    this.doctorService.updateDoctorRoles(doctor.id, this.editedRoles).subscribe({
      next: (updatedDoctor) => {
        const index = this.doctors.findIndex(d => d.id === doctor.id);
        if (index !== -1) {
          this.doctors[index].roles = this.editedRoles;
        }
        this.alertService.success('Roles updated successfully.');
        this.editingDoctorId = null;
        this.editedRoles = [];
      },
      error: () => {
        this.alertService.error('Failed to update roles.');
      }
    });
  }

  toggleRole(role: string): void {
    const idx = this.editedRoles.indexOf(role);
    if (idx > -1) {
      this.editedRoles.splice(idx, 1);
    } else {
      this.editedRoles.push(role);
    }
  }
}
