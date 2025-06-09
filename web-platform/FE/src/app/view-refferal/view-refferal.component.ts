import {Component, ElementRef, OnInit, QueryList, signal, ViewChildren} from '@angular/core';
import {Referral, ReferralType} from "../../shared/interfaces/referral";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../../services/patient.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Patient} from "../../shared/interfaces/patient";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Doctor} from "../../shared/interfaces/doctor";
import {DoctorService} from "../../services/doctor.service";

@Component({
  selector: 'app-view-refferal',
  standalone: true,
  imports: [
    MatExpansionPanelDescription,
    MatIcon,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    DatePipe,
    ReactiveFormsModule,
    MatIconButton,
    MatButton,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './view-refferal.component.html',
  styleUrl: './view-refferal.component.css'
})
export class ViewRefferalComponent implements OnInit{

  readonly panelOpenState = signal(false);
  patient!: Patient;
  referrals: Referral[] = [];
  editForm: FormGroup;

  @ViewChildren('referralRef') referralSections!: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder,
    private doctorsService:DoctorService
  ) {
    this.editForm = this.fb.group({
      reason: ['', Validators.required],
      isResolved: [false],
      type: ['', Validators.required],
      toDoctorId: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  availableDoctors: Doctor[] = [];
  editingReferrals: Record<number, boolean> = {};
  editForms: Record<number, FormGroup> = {};

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;
    this.doctorsService.getDoctors().subscribe(doctors => {
      this.availableDoctors = doctors;
    })

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find(p => p.id === id);
        if (found) {
          this.patient = found;
          this.referrals = found.referrals || [];
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
    }
  }

  enableEdit(referral: Referral): void {
    this.editingReferrals[referral.id] = true;

    this.editForms[referral.id] = this.fb.group({
      reason: [referral.reason || '', Validators.required],
      isResolved: [referral.isResolved || false],
      type: [referral.type || '', Validators.required],
      toDoctorId: [referral.toDoctor?.id || '', Validators.required],
      date: [referral.date ? new Date(referral.date).toISOString().substring(0,10) : '', Validators.required]
    });
  }

  saveEdit(referral: Referral): void {
    const form = this.editForms[referral.id];
    if (!form || form.invalid) return;

    const updatedReferral: Referral = {
      ...referral,
      ...form.value
    };

    const index = this.referrals.findIndex(r => r.id === referral.id);
    if (index !== -1) {
      this.referrals[index] = updatedReferral;
      this.patient.referrals = this.referrals;
      this.patientService.updatePatient(this.patient);
    }

    this.editingReferrals[referral.id] = false;
    delete this.editForms[referral.id];
  }

  cancelEdit(referralId: number): void {
    this.editingReferrals[referralId] = false;
    delete this.editForms[referralId];
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
  exportReferralToPdf(referral: Referral): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Referral #${referral.id}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`From Doctor: ${referral.fromDoctor.firstName} ${referral.fromDoctor.lastName}`, 10, 20);
    doc.text(`To Doctor: ${referral.toDoctor?.firstName} ${referral.toDoctor?.lastName}`, 10, 30);
    doc.text(`Type: ${this.getReferralTypeLabel(referral.type)}`, 10, 40);
    doc.text(`Reason: ${referral.reason}`, 10, 50);
    doc.text(`Date: ${referral.date ? new Date(referral.date).toLocaleDateString() : ''}`, 10, 60);
    doc.text(`Status: ${referral.isResolved ? 'Resolved' : 'Pending'}`, 10, 70);

    doc.save(`referral_${referral.id}.pdf`);
  }
}
