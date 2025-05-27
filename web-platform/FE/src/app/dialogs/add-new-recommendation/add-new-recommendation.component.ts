import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatDialogRef} from "@angular/material/dialog";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-add-new-recommendation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDivider,
    NgIf
  ],
  templateUrl: './add-new-recommendation.component.html',
  styleUrl: './add-new-recommendation.component.css'
})
export class AddNewRecommendationComponent {

  constructor(private dialogRef: MatDialogRef<AddNewRecommendationComponent>, public fb:FormBuilder){}

  recommendationForm = this.fb.group({
    activityType: ['', Validators.required],
    dailyDuration: [null, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: [''],
    additionalNotes: ['']
  });

  onSubmit() {
    if (this.recommendationForm.valid) {
      const data = this.recommendationForm.value;
      console.log('Recommendation saved:', data);
      this.dialogRef.close(data);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
