import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
    MatButton
  ],
  templateUrl: './view-consultations.component.html',
  styleUrl: './view-consultations.component.css'
})
export class ViewConsultationsComponent implements OnInit {
  patientId?: string;
  patient!: Patient;
  referralForm: FormGroup;
  availableDoctors: Doctor[] = [];

  constructor(private route: ActivatedRoute,
              private patientService: PatientService,
              private alertService:AlertService,
              private doctorsService:DoctorService,
              private fb: FormBuilder){
    this.referralForm = this.fb.group({
      reason: ['', Validators.required],
      isResolved: [false],
      type: ['', Validators.required],
      toDoctorId: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

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
    if (this.referralForm.valid) {
      const referral = this.referralForm.value;
      console.log('Referral submitted:', referral);
      this.alertService.success('Referral submitted successfully.');
      this.referralForm.reset({ isResolved: false });
    } else {
      this.alertService.error('Please fill all required fields correctly.');
    }
  }

}
