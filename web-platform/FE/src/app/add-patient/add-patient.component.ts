import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { DiagnosisCodeComponent } from "../diagnosis-code/diagnosis-code.component";
import { IcdService } from "../../services/diagnosis.code.service";
import { PatientService } from "../../services/patient.service";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: 'app-add-new-consultation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  providers: [IcdService, AlertService],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit {
  patientForm!: FormGroup;
  age: number | null = null;
  sex: string | null = null;
  cnpError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      cnp: ['', [Validators.required, Validators.pattern(/^\d{13}$/), this.cnpValidator()]],
      occupation: ['', Validators.required],
      locality: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      block: ['', Validators.pattern(/^[A-Za-z0-9]+$/)],
      staircase: ['', Validators.pattern(/^\d+$/)],
      apartment: ['', Validators.min(1)],
      floor: ['', Validators.min(1)],
      bloodGroup: ['', Validators.required],
      rh: ['', Validators.required],
      weight: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      height: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      birthDate: [{ value: '', disabled: true }],
      sex: [{ value: '', disabled: true }],
    });

    this.patientForm.get('cnp')?.valueChanges.subscribe(val => {
      this.validateAndExtractCNP(val);
    });
  }

  validateAndExtractCNP(cnp: string): void {
    this.age = null;
    this.sex = null;
    this.cnpError = null;

    // if (!/^\d{13}$/.test(cnp)) {
    //   this.cnpError = 'CNP must contain exactly 13 digits.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
    //   this.alertService.error(this.cnpError);
    //   return;
    // }

    const genderCode = parseInt(cnp[0], 10);
    const year = parseInt(cnp.slice(1, 3), 10);
    const month = parseInt(cnp.slice(3, 5), 10);
    const day = parseInt(cnp.slice(5, 7), 10);

    if (month < 1 || month > 12) {
      this.cnpError = 'Invalid month in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      this.alertService.error(this.cnpError);
      return;
    }

    if (day < 1 || day > 31) {
      this.cnpError = 'Invalid day in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      this.alertService.error(this.cnpError);
      return;
    }

    let fullYear: number;
    let genderText: string;

    switch (genderCode) {
      case 1:
      case 2:
        fullYear = 1900 + year;
        genderText = (genderCode === 1) ? 'M' : 'F';
        break;
      case 3:
      case 4:
        fullYear = 1800 + year;
        genderText = (genderCode === 3) ? 'M' : 'F';
        break;
      case 5:
      case 6:
        fullYear = 2000 + year;
        genderText = (genderCode === 5) ? 'M' : 'F';
        break;
      case 7:
      case 8:
        const currentYear = new Date().getFullYear() % 100;
        fullYear = (year > currentYear) ? 1900 + year : 2000 + year;
        genderText = 'Unknown';
        break;
      case 9:
        fullYear = 1900 + year;
        genderText = 'Unknown';
        break;
      default:
        this.cnpError = 'Unknown gender code in CNP.';
        this.patientForm.patchValue({ birthDate: '', sex: '' });
        this.alertService.error(this.cnpError);
        return;
    }

    const birthDate = new Date(fullYear, month - 1, day);

    if (
      birthDate.getFullYear() !== fullYear ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      this.cnpError = 'Invalid birth date in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      this.alertService.error(this.cnpError);
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - fullYear;
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 0 || age > 120) {
      this.cnpError = 'Age derived from CNP is out of valid range.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      this.alertService.error(this.cnpError);
      return;
    }

    this.sex = genderText;
    this.age = age;

    this.patientForm.patchValue({
      birthDate: this.formatDateLocal(birthDate),
      sex: genderText
    });
  }

  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cnpValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cnp = control.value;
      if (!cnp) return null;
      const valid = /^\d{13}$/.test(cnp);
      return valid ? null : { invalidCNP: true };
    };
  }

  onSubmit(): void {
    if (this.patientForm.valid) {

      const patientData = this.patientForm.getRawValue();
      this.patientService.createPatient(patientData).subscribe({
        next: (response) => {
          this.alertService.success('Patient successfully created!');
          this.patientForm.reset();
        },
        error: (error) => {
          this.alertService.error('Failed to create patient. Please try again.');
          console.error('Error creating patient:', error);
        }
      });
    } else {
      this.alertService.error('Form is invalid. Please check all required fields.');
      this.patientForm.markAllAsTouched();
    }
  }
}
