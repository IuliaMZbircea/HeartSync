import { Component, ElementRef, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { Patient } from "../../shared/interfaces/patient";
import { Medication } from "../../shared/interfaces/medication";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { PatientService } from "../../services/patient.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { MedicationService } from "../../services/medication.service";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: 'app-view-medication',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatButton,
    MatIcon,
    MatIconButton,
    DatePipe
  ],
  providers: [MedicationService, AlertService],
  templateUrl: './view-medication.component.html',
  styleUrls: ['./view-medication.component.css']
})
export class ViewMedicationComponent implements OnInit {
  readonly panelOpenState = signal(false);
  patient!: Patient;
  medications: Medication[] = [];
  editForm: FormGroup;
  isEditing = false;

  @ViewChildren('medRef') medSections!: QueryList<ElementRef>;
  @ViewChildren('latestMedRef') latestMedRef!: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private medicationService: MedicationService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      dose: ['', Validators.required],
      frequency: ['', Validators.required],
      route: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      prescribedBy: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe({
        next: (patients: Patient[]) => {
          const found = patients.find(p => p.id === id);
          if (found) {
            this.patient = found;

            this.medicationService.getMedicationsByPatient(this.patient.id!).subscribe({
              next: (meds: Medication[]) => {
                this.medications = meds;
              },
              error: (err) => {
                this.alertService.error('Error loading medications.');
                console.error(err);
              }
            });
          } else {
            this.alertService.error(`Patient with ID ${id} not found.`);
          }
        },
        error: () => {
          this.alertService.error('Error loading patients.');
        }
      });
    } else {
      this.alertService.error('Invalid or missing patient ID in URL.');
    }
  }

  get latestMedication(): Medication | null {
    if (this.medications.length === 0) return null;

    const currentDate = new Date();
    const activeMedications = this.medications.filter(med => !med.endDate || new Date(med.endDate) >= currentDate);

    if (activeMedications.length === 0) return null;

    return activeMedications[activeMedications.length - 1];
  }

  enableEdit(): void {
    const latest = this.latestMedication;
    if (!latest) {
      this.alertService.error('No active medication available to edit.');
      return;
    }

    this.editForm.setValue({
      name: latest.name,
      dose: latest.dose,
      frequency: latest.frequency,
      route: latest.route,
      startDate: this.formatDate(latest.startDate),
      endDate: latest.endDate ? this.formatDate(latest.endDate) : '',
      prescribedBy: latest.prescribedBy,
      notes: latest.notes || ''
    });

    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.editForm.invalid || !this.latestMedication) {
      this.alertService.error('Form is invalid or no medication selected.');
      return;
    }

    const updated = this.editForm.value;

    const updatedMedication: Partial<Medication> = {
      ...updated,
      startDate: new Date(updated.startDate),
      endDate: updated.endDate ? new Date(updated.endDate) : undefined
    };

    this.medicationService.updateMedication(this.latestMedication.id!, updatedMedication).subscribe({
      next: () => {
        const index = this.medications.indexOf(this.latestMedication!);
        if (index !== -1) {
          this.medications[index] = {
            ...this.latestMedication!,
            ...updatedMedication
          } as Medication;
        }
        this.isEditing = false;
        this.alertService.success('Medication updated successfully!');
      },
      error: err => {
        this.alertService.error('Error updating medication.');
        console.error(err);
      }
    });
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  exportSingleMedicationToPdf(element: ElementRef | HTMLElement, medication: Medication): void {
    const nativeElement = element instanceof ElementRef ? element.nativeElement : element;

    const clone = nativeElement.cloneNode(true) as HTMLElement;
    clone.classList.add('pdf-export');
    document.body.appendChild(clone);

    html2canvas(clone, {
      scrollY: 0,
      scrollX: 0,
      useCORS: true,
      backgroundColor: '#ffffff',
      scale: 2
    }).then(canvas => {
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = 210;
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

      const medName = medication.name.replace(/\s+/g, '_');
      doc.save(`medication_${medName}.pdf`);
    }).catch(err => {
      console.error('Error exporting PDF:', err);
    });
  }
}
