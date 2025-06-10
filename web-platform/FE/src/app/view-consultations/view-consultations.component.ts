import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatDivider} from "@angular/material/divider";
import {DatePipe, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {Patient} from "../../shared/interfaces/patient";
import {PatientService} from "../../services/patient.service";
import {AlertService} from "../../services/alert.service";
import {MatIcon} from "@angular/material/icon";
import {DoctorService} from "../../services/doctor.service";
import {ReferralType} from "../../shared/interfaces/referral";
import {Doctor} from "../../shared/interfaces/doctor";
import {MatButton} from "@angular/material/button";
import {Medication} from "../../shared/interfaces/medication";
import {MedicationService} from "../../services/medication.service";
import {ReferralService} from "../../services/refferal.service";
import {AuthService} from "../../services/auth.service";
import {DiagnosisCodeComponent} from "../diagnosis-code/diagnosis-code.component";

@Component({
  selector: 'app-view-consultations',
  standalone: true,
  imports: [
    FormsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    ReactiveFormsModule,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    NgForOf,
    NgIf,
    MatIcon,
    DatePipe,
    TitleCasePipe,
    MatButton,
    DiagnosisCodeComponent
  ],
  templateUrl: './view-consultations.component.html',
  styleUrl: './view-consultations.component.css'
})
export class ViewConsultationsComponent implements OnInit {
  patientId?: string;
  patient!: Patient;
  referralForm: FormGroup;
  availableDoctors: Doctor[] = [];
  medicationForm: FormGroup;
  private currentUserId!: number | undefined;
  diagnosisForm!: FormGroup;

  constructor(private route: ActivatedRoute,
              private patientService: PatientService,
              private doctorsService:DoctorService,
              private fb: FormBuilder,
              private medicationService: MedicationService,
              private referralService: ReferralService,
              private alertService: AlertService,
              private authService: AuthService,
              private diseaseService:PatientService)
  {
    this.referralForm = this.fb.group({
      reason: ['', Validators.required],
      isResolved: [false],
      type: ['', Validators.required],
      toDoctorId: [null, Validators.required]
    });

    this.medicationForm = this.fb.group({
      name: ['', Validators.required],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      route: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      prescribedBy: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    this.authService.getCurrentUser().subscribe((user: Doctor) => {
      this.currentUserId = user.id;
      console.log("USER", user)
    });
    this.doctorsService.getDoctors().subscribe(doctors => {
      this.availableDoctors = doctors;
    })

    if (id !== null) {
      this.patientService.getPatientById(id).subscribe(patient => {
        this.patient = patient;
        console.log(patient)
      }, error => {
        this.alertService.error('Pacientul nu a fost găsit.');
      });
    }

    this.diagnosisForm = this.fb.group({
      diagnosis: ['', Validators.required],
      icdCode: [{ value: 'fsfef', disabled: true }],
      category: ['', Validators.required],
      description: ['']
    });

  }

  referralTypes: ReferralType[] = [
    'FAMILY_TO_SPECIALIST',
    'SPECIALIST_TO_ANALYSIS',
    'SPECIALIST_TO_HOSPITAL',
    'SPECIALIST_TO_TREATMENT',
    'SPECIALIST_TO_PROCEDURE'
  ];

  getReferralTypeLabel(type: ReferralType): string {
    switch (type) {
      case 'FAMILY_TO_SPECIALIST': return 'Family - Specialist';
      case 'SPECIALIST_TO_ANALYSIS': return 'Specialist -Analysis';
      case 'SPECIALIST_TO_HOSPITAL': return 'Specialist - Hospital';
      case 'SPECIALIST_TO_TREATMENT': return 'Specialist - Treatment';
      case 'SPECIALIST_TO_PROCEDURE': return 'Specialist - Procedure';
      default: return type;
    }
  }

  submitReferral(): void {
    if (this.referralForm.valid && this.patient?.id) {
      const referral = {
        reason: this.referralForm.value.reason,
        isResolved: this.referralForm.value.isResolved,
        type: this.referralForm.value.type,
        date: new Date(),
        patient_id: this.patient.id,
        fromDoctor: this.currentUserId,
        toDoctor: Number(this.referralForm.value.toDoctorId)
      };
      console.log(referral);

      this.referralService.createReferral(referral).subscribe({
        next: () => {
          this.alertService.success('Referral submitted successfully.');
          this.referralForm.reset({ isResolved: false });
          this.patientService.getPatientById(this.patient.id).subscribe(updated => {
            this.patient = updated;
          });
        },
        error: () => {
          this.alertService.error('Eroare la trimiterea trimiterii.');
        }
      });
    } else {
      this.alertService.error('Please fill all required fields correctly.');
    }
  }

  saveEdit(): void {
    if (this.medicationForm.invalid || !this.patient?.id) {
      this.alertService.error('Formularul este invalid sau pacientul nu este încărcat.');
      return;
    }

    const formValue = this.medicationForm.value;
    const medication = {
      ...formValue,
      patient_id: this.patient.id
    };

    this.medicationService.createMedication(medication).subscribe({
      next: () => {
        this.alertService.success('Medicația a fost salvată cu succes.');
        this.medicationForm.reset();
        this.patientService.getPatientById(this.patient.id).subscribe(updated => {
          this.patient = updated;
        });
      },
      error: () => {
        this.alertService.error('Eroare la salvarea medicației.');
      }
    });
  }

  get diseases(): FormArray {
    return this.diagnosisForm.get('diseases') as FormArray;
  }

  onDiseaseSelected(disease: { title: string, code: string }) {
    this.diagnosisForm.patchValue({
      diagnosis: disease.title,
      icdCode: disease.code
    });
  }

  saveDiagnoses(): void {
    // if (this.diagnosisForm.invalid || !this.patient?.id) {
    //   this.alertService.error('Please complete all required fields.');
    //   return;
    // }

    const d = this.diagnosisForm.getRawValue();

    const payload = {
      patient_id: this.patient.id,
      name: d.diagnosis,
      type: d.category,
      description: d.description
    };

    this.diseaseService.addDisease(payload).subscribe({
      next: () => {
        this.alertService.success(`The disease "${d.diagnosis}" was successfully added.`);
        this.diagnosisForm.reset();
      },
      error: () => {
        this.alertService.error('An error occurred while saving the disease.');
      }
    });
  }

}
