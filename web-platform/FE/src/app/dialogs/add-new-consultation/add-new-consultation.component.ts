import { Component } from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-new-consultation',
  standalone: true,
  imports: [
    MatDivider
  ],
  templateUrl: './add-new-consultation.component.html',
  styleUrl: './add-new-consultation.component.css'
})
export class AddNewConsultationComponent {

  constructor(private dialogRef: MatDialogRef<AddNewConsultationComponent>){}

  close(): void {
    this.dialogRef.close();
  }

}
