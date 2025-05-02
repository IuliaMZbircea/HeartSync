import {Component, Input} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    MatDivider
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {

  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>){}

  @Input() message: string = 'Are you sure you want to block this account? Existing data will remain recorded and may still be visible.';

  close(): void {
    this.dialogRef.close();
  }
}
