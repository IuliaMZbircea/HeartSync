import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  providers: [AlertService],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
  ) {
    this.resetForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.errorMessage = 'The reset token is invalid or missing.';
      }
    });
  }

  onSubmit() {
    if (!this.token) {
      this.errorMessage = 'The token is required for reset.';
      return;
    }

    if (this.resetForm.invalid) {
      this.errorMessage = 'The form contains errors.';
      return;
    }

    const newPassword = this.resetForm.get('password')!.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.alertService.success('The password was successfully reset.');
        this.errorMessage = null;
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Error resetting the password.';
        this.successMessage = null;
      }
    });
  }
}
