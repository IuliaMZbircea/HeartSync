import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { DoctorI } from "../../shared/interfaces/doctor";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isAuthenticated: boolean = false;
  fullName: string = '';
  role:string='';

  constructor(private router: Router, private authService: AuthService) {}

  navigateToHome() {
    this.router.navigate(['/Home']);
  }

  navigateToDashboard() {
    this.router.navigate(['/admin-dashboard']);
  }

  navigateToAuth() {
    this.router.navigate(['/Login']);
  }

  navigateToPatientList() {
    this.router.navigate(['/PatientList']);
  }

  navigateToHelpSection() {
    this.router.navigate(['/Help']);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false;
      this.fullName = '';
      this.router.navigate(['/Home']);
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: DoctorI) => {
      this.isAuthenticated = !!user?.id;
      this.role=user.roles[1]
      this.fullName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : '';
    });
  }
}
