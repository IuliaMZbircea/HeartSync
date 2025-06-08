import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Patient} from "../interfaces/patient";
import {PatientService} from "../services/patient.service";
import {ActivatedRoute} from "@angular/router";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-view-emr',
  standalone: true,
    imports: [
        DatePipe,
        NgForOf,
        NgIf
    ],
  templateUrl: './view-emr.component.html',
  styleUrl: './view-emr.component.css'
})
export class ViewEMRComponent implements OnInit {

  patient!:Patient;
  @ViewChild('patientFileRef', { static: false }) patientFileRef!: ElementRef;

  constructor(private patientService:PatientService,private route: ActivatedRoute,){}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam && !isNaN(+idParam) ? Number(idParam) : null;

    if (id !== null) {
      this.patientService.getPatients().subscribe((patients: Patient[]) => {
        const found = patients.find(p => p.id === id);
        if (found) {
          this.patient = found;
        } else {
          console.warn(`Patient with ID ${id} not found.`);
        }
      });
    } else {
      console.error('Invalid or missing patient ID in route.');
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

      const pageWidth = 210; // mm
      const pageHeight = 297; // mm
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

      pdf.save(`patient_file.pdf`);
    }).catch(err => {
      console.error('Eroare la generarea PDF:', err);
      document.body.style.overflow = originalBodyOverflow;
      clone.remove();
    });
  }

}
