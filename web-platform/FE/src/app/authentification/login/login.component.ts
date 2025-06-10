import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {DoctorService} from "../../../services/doctor.service";
import {AuthService} from "../../../services/auth.service";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    RouterLink
  ],
  providers: [AlertService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements AfterViewInit {
  passwordFieldType: string = 'password';
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService

  ) {}

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: (user) => {
        this.alertService.success('Login successful!');

        if (user.roles && user.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/PatientList']);
        }
      },
      error: (err) => {
        this.alertService.error('Email sau parolă greșită.');
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.sign-in-section');
      elements.forEach(el => el.classList.add('page-turn'));
    });
  }
  forgotPasswordUser(): void {

    this.authService.forgotPassword(this.email).subscribe({

      next: () => {
        this.alertService.success('A reset email has been sent. Please check your inbox.');
      },
      error: (errMessage) => {
        this.alertService.error(errMessage);
        console.error(errMessage);
      }
    });
  }

}
