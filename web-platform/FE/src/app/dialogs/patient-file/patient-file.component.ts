import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Patient} from "../../../shared/interfaces/patient";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {PatientService} from "../../../services/patient.service";
import {HoverScaleDirective} from "../../directives/hover-scale.directive";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-patient-file',
  standalone: true,
  imports: [
    MatDivider,
    DatePipe,
    NgIf,
    NgForOf,
    HoverScaleDirective
  ],
  templateUrl: './patient-file.component.html',
  styleUrl: './patient-file.component.css'
})
export class PatientFileComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PatientFileComponent>,
              private patientService: PatientService,
              @Inject(MAT_DIALOG_DATA) public data: { id: string }) {}

  @Input() patient!: Patient;
  @Input() alarms: Patient[] = [];
  @ViewChild('patientContent', { static: true }) patientContent!: ElementRef;

  exportToPDF(): void {
    const content = this.patientContent.nativeElement;

    const originalWidth = content.style.width;
    const originalHeight = content.style.height;
    const originalOverflow = content.style.overflow;

    content.style.width = content.scrollWidth + 'px';
    content.style.height = content.scrollHeight + 'px';
    content.style.overflow = 'visible';

    html2canvas(content, {
      scrollY: 0,
      scrollX: 0,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      content.style.width = originalWidth;
      content.style.height = originalHeight;
      content.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL('image/png');

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const doc = new jsPDF('p', 'mm', 'a4');

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('pacient.pdf');
    }).catch(err => {
      console.error('Eroare la capturare:', err);
    });
  }



  ngOnInit() {
    this.patientService.getPatients().subscribe(patients => {
      const found = patients.find(p => p.cnp === this.data.id);
      if (found) {
        this.patient = found;
      }
      console.log(this.patient)
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
