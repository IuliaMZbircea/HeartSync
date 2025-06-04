import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import {debounceTime, of, switchMap} from "rxjs";
import {IcdService} from "../../services/diagnosis.code.service";
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
  age = 0;
  token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDkwNDAzMzAsImV4cCI6MTc0OTA0MzkzMCwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl81NGIzZmZiNC1jMjc3LTQ0NDItYTUyZi0yMDY3YmRkNTM3NzQiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.XSHsBcJm8eHMfvocuTDUMP-nlHXmJOTfUKgkEY6pC_cq3lzq4j-iARjS-chN2T5yFE8hmlt0OBGl_LpbbzPDQk0Daa5NpQZlmvheHO-Y_xTjL6KVxVwatuXYIOAT0k7lnPbt8dffDClViKE-FovkadDQHdqIRgk3l2svFrMGUkIn7ZFJyjyK63KS1qez_AcFCU5qCVKynAJjaPh7hZ7T-FUAwFABOfwwatcYgr2Dk4FPgLcpfZ9SiC3QftO33UXDaLbRab0zhVj-B4YrecQIWyQNBdZRJ0YyYMLsw_Q9K31CIdUQY9-clZRXUk3KkIIR-6nw5KdJYettInZcbFt9vQ'
  diseaseSuggestions: Array<any[]> = [];
  constructor(private fb: FormBuilder, private icdService: IcdService) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      cnp: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
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
      diseases: this.fb.array([])
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
    if (!/^\d{13}$/.test(cnp)) return;
    const year = parseInt(cnp.slice(1, 3), 10);
    const month = parseInt(cnp.slice(3, 5), 10);
    const day = parseInt(cnp.slice(5, 7), 10);
    const genderCode = cnp[0];

    const prefix = genderCode === '1' || genderCode === '2' ? '19' : '20';
    const birthDate = new Date(`${prefix}${year}-${month}-${day}`);
    this.age = new Date().getFullYear() - birthDate.getFullYear();
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
  getDiseaseNameControl(i: number): FormControl {
    return this.diseases.at(i).get('name') as FormControl;
  }
}
