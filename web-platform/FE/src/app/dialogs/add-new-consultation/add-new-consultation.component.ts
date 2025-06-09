import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import {debounceTime, of, switchMap} from "rxjs";
import {IcdService} from "../../../services/diagnosis.code.service";
import {DiagnosisCodeComponent} from "../../diagnosis-code/diagnosis-code.component";

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
  templateUrl: './add-new-consultation.component.html',
  styleUrl: './add-new-consultation.component.css'
})
export class AddNewConsultationComponent implements OnInit {
  patientForm!: FormGroup;
  age: number | null = null;
  sex: string | null = null;
  cnpError: string | null = null;
  token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDkxMzg2NzMsImV4cCI6MTc0OTE0MjI3MywiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl81NGIzZmZiNC1jMjc3LTQ0NDItYTUyZi0yMDY3YmRkNTM3NzQiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.nVvYYkrlr7UP555CpTpZjU9mZ9Fux53oIRA9hwKagjLRln-bbnvRqLdJBBdRyYl5DuISCOeUg_uIwbUiH-WUjZsKJ3TeZCLfp_VrdMTKhmB8Zils5uUTEY0rl0k7L-4KYhs-93FPZcCKUVoFVdIRIS1VPiw8VT6BUy2ADaaUaQog9-nIfE3QC6ubSvgV4qCW-v1Gc6o-kV3ZucgoOwAfntsSfDLjmcw1Irv05XbFDlL22MWs8R--AUaq_pKHEjMOm7cDoPwMz7zgiBJTolbEBg_WzXPQpsFFQOuezs3E6_u3XI820Dv9al8O94zWVgoqfAIS0mnfFDmsrrpmTkI6TQ'
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
      this.cnpError = 'CNP-ul trebuie să conțină exact 13 cifre.';
      this.patientForm.patchValue({
        birthDate: '',
        sex: ''
      });
      return;
    }

    const genderCode = parseInt(cnp[0], 10);
    const year = parseInt(cnp.slice(1, 3), 10);
    const month = parseInt(cnp.slice(3, 5), 10);
    const day = parseInt(cnp.slice(5, 7), 10);

    let fullYear: number;
    let genderText: string;
    switch (genderCode) {
      case 1:
      case 3:
      case 5:
        fullYear = (genderCode === 5 ? 2000 : 1900) + year;
        genderText = 'Masculin';
        break;
      case 2:
      case 4:
      case 6:
        fullYear = (genderCode === 6 ? 2000 : 1900) + year;
        genderText = 'Feminin';
        break;
      default:
        this.cnpError = 'CNP-ul are un cod de sex necunoscut.';
        this.patientForm.patchValue({
          birthDate: '',
          sex: ''
        });
        return;
    }

    const birthDate = new Date(fullYear, month - 1, day);
    if (
      birthDate.getFullYear() !== fullYear ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      this.cnpError = 'Data nașterii din CNP nu este validă.';
      this.patientForm.patchValue({
        birthDate: '',
        sex: ''
      });
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - fullYear;
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 0 || age > 99) {
      this.cnpError = 'Vârsta calculată din CNP este în afara limitelor.';
      this.patientForm.patchValue({
        birthDate: '',
        sex: ''
      });
      return;
    }

    this.sex = genderText;
    this.age = age;

    this.patientForm.patchValue({
      birthDate: birthDate.toISOString().substring(0, 10),
      sex: this.sex
    });
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
