import { Component } from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-add-new-consultation',
  standalone: true,
  imports: [
    MatDivider,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './add-new-consultation.component.html',
  styleUrl: './add-new-consultation.component.css'
})
export class AddNewConsultationComponent {

  patientForm!: FormGroup;
  successMessage = '';
  age = 0;

  constructor(private dialogRef: MatDialogRef<AddNewConsultationComponent>, private fb: FormBuilder){}

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
  }

  get diseases(): FormArray {
    return this.patientForm.get('diseases') as FormArray;
  }

  addDisease(disease: any = { name: '', category: '', description: '' }): void {
    this.diseases.push(
      this.fb.group({
        name: [disease.name],
        category: [disease.category],
        description: [disease.description]
      })
    );
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

    this.patientForm.patchValue({
      birthDate: birthDate,
      sex: genderCode === '1' || genderCode === '3' ? 'M' : 'F'
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      console.log(patientData);
      this.successMessage = 'Patient added successfully!';
    } else {
      this.successMessage = '';
      this.patientForm.markAllAsTouched();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
