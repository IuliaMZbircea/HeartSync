import { Component } from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-new-alarm',
  standalone: true,
  imports: [
    MatDivider,
    ReactiveFormsModule
  ],
  templateUrl: './add-new-alarm.component.html',
  styleUrl: './add-new-alarm.component.css'
})
export class AddNewAlarmComponent {

  constructor(public fb:FormBuilder, private dialogRef: MatDialogRef<AddNewAlarmComponent>) {}

  alarmForm = this.fb.group({
    parameter: ['', Validators.required],
    condition: ['', Validators.required],
    threshold: [null, [Validators.required, Validators.min(0)]],
    duration: [null, [Validators.required, Validators.min(1)]],
    afterActivity: ['false', Validators.required],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit() {
    if (this.alarmForm.valid) {
      const alarmData = this.alarmForm.value;
      console.log('Saving alarm:', alarmData);
      this.alarmForm.reset();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
