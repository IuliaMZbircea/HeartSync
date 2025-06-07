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
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Patient} from "../interfaces/patient";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import {MatButton, MatIconButton} from "@angular/material/button";

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
    NgForOf
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
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      reason: ['', Validators.required],
      isResolved: [false]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

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
    this.selectedReferral = referral;
    this.editForm.setValue({
      reason: referral.reason,
      isResolved: referral.isResolved
    });
    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.selectedReferral) return;

    const updatedReferral: Referral = {
      ...this.selectedReferral,
      ...this.editForm.value
    };

    const index = this.referrals.findIndex(r => r.id === this.selectedReferral!.id);
    if (index !== -1) {
      this.referrals[index] = updatedReferral;
      this.patient.referrals = this.referrals;
      this.patientService.updatePatient(this.patient);
    }

    this.isEditing = false;
    this.selectedReferral = null;
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
