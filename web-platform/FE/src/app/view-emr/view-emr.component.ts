import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Patient } from '../../shared/interfaces/patient';
import { PatientService } from '../../services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-view-emr',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './view-emr.component.html',
  styleUrl: './view-emr.component.css'
})
export class ViewEMRComponent implements OnInit {

  isEditingPersonal = false;
  isEditingContact = false;
  isEditingAddress = false;
  isEditingMedical = false;

  patient!: Patient;
  patientForm!: FormGroup;

  @ViewChild('patientFileRef', { static: false }) patientFileRef!: ElementRef;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatientById(id).subscribe(patient => {
        this.patient = patient;

        this.patientForm = this.fb.group({
          email: [patient.email, [Validators.required, Validators.email]],
          phone: [patient.phone, Validators.required],
          firstName: [patient.firstName, Validators.required],
          lastName: [patient.lastName, Validators.required],
          cnp: [patient.cnp, [Validators.required, Validators.pattern(/^[0-9]{13}$/)]],
          sex: [patient.sex],
          birthDate: [patient.birthDate],
          occupation: [patient.occupation, Validators.required],
          locality: [patient.locality, Validators.required],
          street: [patient.street, Validators.required],
          number: [patient.number, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
          block: [patient.block],
          staircase: [patient.staircase],
          apartment: [patient.apartment],
          floor: [patient.floor],
          bloodGroup: [patient.bloodGroup, Validators.required],
          rh: [patient.rh, Validators.required],
          weight: [patient.weight, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
          height: [patient.height, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        });
      });
    }
  }

  onSubmit(): void {
    if (this.patientForm.valid && this.patient?.id) {
      this.patientService.updatePatient(this.patient.id, this.patientForm.value).subscribe({
        next: () => this.alertService.success('Patient updated successfully'),
        error: err => this.alertService.error('Error updating patient')
      });
    }
  }

  exportPatientFileToPdf(element: HTMLElement): void {
    const originalBodyOverflow = document.body.style.overflow;

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = element.offsetWidth + 'px';
    clone.style.height = element.offsetHeight + 'px';
    clone.style.overflow = 'visible';
    clone.style.backgroundColor = '#ffffff';
    clone.style.zIndex = '9999';
    clone.style.boxShadow = 'none';

    document.body.appendChild(clone);
    document.body.style.overflow = 'hidden';

    html2canvas(clone, {
      scrollY: 0,
      scrollX: 0,
      useCORS: true,
      backgroundColor: '#ffffff',
      scale: 1
    }).then(canvas => {
      document.body.style.overflow = originalBodyOverflow;
      clone.remove();

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('patient_file.pdf');
    }).catch(err => {
      console.error('Eroare la generarea PDF:', err);
      document.body.style.overflow = originalBodyOverflow;
      clone.remove();
    });
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  editSection(section: string): void {
    const key = 'isEditing' + this.capitalize(section);
    (this as any)[key] = !(this as any)[key];
  }

}
