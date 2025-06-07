import {Component, ElementRef, OnInit, QueryList, signal, ViewChildren} from '@angular/core';
import {Referral, ReferralType} from "../interfaces/referral";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute} from "@angular/router";
import {PatientService} from "../services/patient.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Patient} from "../interfaces/patient";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Doctor} from "../interfaces/doctor";
import {DoctorService} from "../services/doctor.service";

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
  isEditing = false;
  selectedReferral: Referral | null = null;

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
      case 'FAMILY_TO_SPECIALIST': return 'Family → Specialist';
      case 'SPECIALIST_TO_ANALYSIS': return 'Specialist → Analysis';
      case 'SPECIALIST_TO_HOSPITAL': return 'Specialist → Hospital';
      case 'SPECIALIST_TO_TREATMENT': return 'Specialist → Treatment';
      case 'SPECIALIST_TO_PROCEDURE': return 'Specialist → Procedure';
      default: return type;
    }
  }

  exportReferralToPdf(element: HTMLElement, referral: Referral): void {
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;

    element.style.width = 'auto';
    element.style.height = 'auto';
    element.style.overflow = 'visible';

    html2canvas(element, {
      scrollY: 0,
      scrollX: 0,
      useCORS: true,
      backgroundColor: '#ffffff',
      scale: 0.7
    }).then(canvas => {
      element.style.width = originalWidth;
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL('image/jpeg', 0.8);

      const scaleFactor = 0.7;
      const imgWidth = 210 * scaleFactor;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `referral_${referral.id}.pdf`;
      doc.save(filename);
    }).catch(err => {
      console.error('Eroare la capturare PDF:', err);
    });
  }
}
