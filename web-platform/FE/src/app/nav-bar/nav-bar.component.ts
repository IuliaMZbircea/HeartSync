import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {Router, RouterLink} from "@angular/router";
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isAuthenticated: boolean = false;

  constructor(private router: Router){}

  navigateToHome() {
    this.router.navigate(['/Home']);
  }

  navigateToAuth(){
    this.router.navigate(['/Register']);
  }

  navigateToHelpSection(){
    this.router.navigate(['/Help']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated = false;

    this.router.navigate(['/Home']);
  }
}
