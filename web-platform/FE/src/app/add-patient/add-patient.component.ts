import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators} from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import {debounceTime, of, switchMap} from "rxjs";
import {DiagnosisCodeComponent} from "../diagnosis-code/diagnosis-code.component";
import {IcdService} from "../../services/diagnosis.code.service";

@Component({
  selector: 'app-add-new-consultation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    DiagnosisCodeComponent
  ],
  providers: [IcdService],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit {
  patientForm!: FormGroup;
  age: number | null = null;
  sex: string | null = null;
  cnpError: string | null = null;
  token='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDk1MDk2NzEsImV4cCI6MTc0OTUxMzI3MSwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl9mZjlkOTVmZS04MGEyLTQ5NmMtYjI0YS1jMDVkNzE0YTY1NTUiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.H-oYxiwm5AGZxtsAdB-KAiuiA3aLnheAy_kDJGSZM8XH6hegiFUijL4Yfwg4BHLaJRH87O8E9_DZi62WTrYLiDowpJMMLkldNuvEnv8jpYxig93JjSs3qihky2orGv0BdT5V58sNmxkMCol-PohzotKRMtDLQqX2EXE745deB9JwUY71gxlN17PsP163GWxmaXyy5vVrtYZ6BjQ1MNmAhEgelVcO5kyr3sMtvVniYtbKRbz5hXazKjb6JdqhutFgLYm0WJlWM2qu2aG2PzP3xRyR_lgQPFDHVObgpkYdX-qt5c9eAJQPxj4rgm0AjV6ycT-XUPVJzopP3lDvPtymlQ'
  diseaseSuggestions: Array<any[]> = [];
  constructor(private fb: FormBuilder, private icdService: IcdService) { }
  ngOnInit(): void {
    this.patientForm = this.fb.group({
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      cnp: ['', [Validators.required, Validators.pattern(/^\d{13}$/),this.cnpValidator()]],
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
      allergies: [''],
      diseases: this.fb.array([]),
      birthDate: [{ value: '', disabled: true }],
      sex: [{ value: '', disabled: true }],
    });

    this.patientForm.get('cnp')?.valueChanges.subscribe(val => {
      this.validateAndExtractCNP(val);
    });
    this.addDisease();

  }

  get diseases(): FormArray {
    return this.patientForm.get('diseases') as FormArray;
  }

  createDiseaseGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      category: ['Infectious'],
      description: [''],
      icdCode: ['']
    });
  }

  addDisease() {
    this.diseases.push(this.createDiseaseGroup());
    this.diseaseSuggestions.push([]);

    const index = this.diseases.length - 1;
    const control = this.diseases.at(index).get('name');

    control?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (!value?.trim()) {
          this.diseaseSuggestions[index] = [];
          return of(null);
        }
        return this.icdService.searchDisease(value, this.token);
      })
    ).subscribe((res: any) => {
      if (res?.destinationEntities?.length > 0) {
        this.diseaseSuggestions[index] = res.destinationEntities.map((item: any) => ({
          title: this.stripHtmlTags(item.title),
          code: item.code || item.theCode || 'N/A'
        }));
      } else {
        this.diseaseSuggestions[index] = [];
      }
    });
  }

  stripHtmlTags(text: string): string {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  }
  validateAndExtractCNP(cnp: string): void {
    this.age = null;
    this.sex = null;
    this.cnpError = null;

    if (!/^\d{13}$/.test(cnp)) {
      this.cnpError = 'CNP must contain exactly 13 digits.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    const genderCode = parseInt(cnp[0], 10);
    const year = parseInt(cnp.slice(1, 3), 10);
    const month = parseInt(cnp.slice(3, 5), 10);
    const day = parseInt(cnp.slice(5, 7), 10);

    if (month < 1 || month > 12) {
      this.cnpError = 'Invalid month in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    if (day < 1 || day > 31) {
      this.cnpError = 'Invalid day in CNP.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    let fullYear: number;
    let genderText: string;

    switch (genderCode) {
      case 1:
      case 2:
        fullYear = 1900 + year;
        genderText = (genderCode === 1) ? 'Male' : 'Female';
        break;
      case 3:
      case 4:
        fullYear = 1800 + year;
        genderText = (genderCode === 3) ? 'Male' : 'Female';
        break;
      case 5:
      case 6:
        fullYear = 2000 + year;
        genderText = (genderCode === 5) ? 'Male' : 'Female';
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
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - fullYear;
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 0 || age > 120) {
      this.cnpError = 'Age calculated from CNP is out of valid range.';
      this.patientForm.patchValue({ birthDate: '', sex: '' });
      return;
    }

    this.sex = genderText;
    this.age = age;

    this.patientForm.patchValue({
      birthDate: this.formatDateLocal(birthDate),
      sex: this.sex
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
      console.log('Form data:', this.patientForm.value);
    } else {
      this.patientForm.markAllAsTouched();
    }
  }
  onDiseaseSelected(index: number, disease: {title: string, code: string}) {
    const diseaseGroup = this.diseases.at(index);
    diseaseGroup.patchValue({
      name: disease.title,
      icdCode: disease.code
    });
  }
}

