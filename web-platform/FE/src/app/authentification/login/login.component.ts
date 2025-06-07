import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {DoctorService} from "../../services/doctor.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements AfterViewInit {
  passwordFieldType: string = 'password';
  email: string = '';
  password: string = '';

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {
    this.doctorService.getDoctors().subscribe(doctors => {
      const foundDoctor = doctors.find(d => d.email === this.email && d.password === this.password);

      if (foundDoctor) {
        this.authService.login(foundDoctor);
        this.router.navigate(['/PatientList']);
      } else {
        alert('Email sau parolă greșită.');
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.sign-in-section');
      elements.forEach(el => el.classList.add('page-turn'));
    });
  }

}
