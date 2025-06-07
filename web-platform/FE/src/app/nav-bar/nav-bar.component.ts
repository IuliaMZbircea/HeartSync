import {Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {Router, RouterLink} from "@angular/router";
import {CommonModule, NgIf} from "@angular/common";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isAuthenticated: boolean = false;
  fullName:string='';

  constructor(private router: Router, private authService: AuthService){}

  navigateToHome() {
    this.router.navigate(['/Home']);
  }

  navigateToAuth(){
    this.router.navigate(['/Login']);
  }

  navigateToHelpSection(){
    this.router.navigate(['/Help']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/Home']);
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLogged) => {
      this.isAuthenticated = isLogged;

      const doctorData = localStorage.getItem('loggedDoctor');
      if (doctorData) {
        const doctor = JSON.parse(doctorData);
        this.fullName = doctor.name ?? `Dr. ${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`;
      } else {
        this.fullName = '';
      }
    });
  }
}
