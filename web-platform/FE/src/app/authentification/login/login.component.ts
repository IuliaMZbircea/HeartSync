import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

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

  constructor() {

  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.sign-in-section');
      elements.forEach(el => el.classList.add('page-turn'));
    });
  }

}
