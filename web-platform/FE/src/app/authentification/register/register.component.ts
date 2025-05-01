import { Component } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule,FormsModule],
  providers: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  passwordFieldType: string = 'password';
  email: string = '';
  password: string = '';

  constructor() {
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  register() {
  }

}
