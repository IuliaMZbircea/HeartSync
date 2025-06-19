import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { DoctorI } from "../../shared/interfaces/doctor";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatIconModule, CommonModule, TranslatePipe, MatOption, MatSelect, MatFormField],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isAuthenticated: boolean = false;
  fullName: string = '';
  role:string='';

  constructor(private router: Router, private authService: AuthService, private translateService: TranslateService,) {}
  currentLang = this.translateService.currentLang || 'en';

  navigateToHome() {
    this.router.navigate(['/Home']);
  }
  changeLanguage(lang: string) {
    this.translateService.use(lang);
    this.currentLang = lang;
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
      this.role = user.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : user.roles[0];
      this.fullName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : '';
    });
  }

  protected readonly HTMLSelectElement = HTMLSelectElement;
}
