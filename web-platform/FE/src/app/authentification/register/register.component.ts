import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent  implements AfterViewInit{
  passwordFieldType: string = 'password';
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
  ) {}

  register(): void {
    if (!this.email || !this.password || !this.firstName || !this.lastName) {
      this.alertService.error('All fields are required.');
      return;
    }

    const userPayload = {
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName
    };

    this.authService.registerUser(userPayload).subscribe({
      next: (user) => {
        this.alertService.success('User registered successfully!');
        this.router.navigate(['/PatientList']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.alertService.error('Registration failed.');
      }
    });
  }


  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.sign-in-section');
      elements.forEach(el => el.classList.add('page-turn'));
    });
  }
}
