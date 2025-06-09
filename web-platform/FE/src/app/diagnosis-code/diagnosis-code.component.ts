import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IcdService} from "../../services/diagnosis.code.service";
import {debounceTime, of, switchMap} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-diagnosis-code',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './diagnosis-code.component.html',
  styleUrl: './diagnosis-code.component.css'
})

export class DiagnosisCodeComponent {
  diseaseControl = new FormControl('');
  icdCode: string = '';
  suggestions: any[] = [];
  token='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDk0OTg0MDcsImV4cCI6MTc0OTUwMjAwNywiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl81NGIzZmZiNC1jMjc3LTQ0NDItYTUyZi0yMDY3YmRkNTM3NzQiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.unzqcmtrMK6QEvmqiBaVmik4JUHE1wfTdCG0pIy1A_mt-lbLrceWLEqwojEVS_Q785A1__BXkZHu6P9TQxZ1x5C6UR8F4UPzf59Qo4Djk0Jj43An8bbJGniVttdz_S4wPGM65n7TEkLNmQIwpcVFBeyfT3ePtlkpBXpq17exGJ04FTQg9_RxtYWFz1FlH9gqyXTVK_FeM5IVbtQV9bKwvXykeG-FC1f_CPjmGT3oMSSotaixA-j9iC6I_i_rSR4t6sPoy4Kc2KoShZrJuLQt2RWaYisAHQBcYnTQNrAjuzFjbIYdfAe2w_d639khkaw_rvaAzGyS2JdmG_kQDVmiTA'
  @Output() diseaseSelected = new EventEmitter<{title: string, code: string}>();


  constructor(private icdService: IcdService) {

    this.diseaseControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (!value?.trim()) {
          this.suggestions = [];
          this.icdCode = '';
          return of(null);
        }
        return this.icdService.searchDisease(value, this.token);
      })
    ).subscribe((res: any) => {
      console.log('Received result:', res);
      if (res?.destinationEntities?.length > 0) {
        this.suggestions = res.destinationEntities.map((item: any) => ({
          title: this.stripHtmlTags(item.title),
          code: item.code || item.theCode || 'N/A'
        }));
      } else {
        this.suggestions = [];
      }
    });
  }

    onSelect(item: any)
    {
      this.diseaseControl.setValue(item.title, { emitEvent: false });
      this.diseaseSelected.emit({ title: item.title, code: item.code });
      this.suggestions = [];

    }

    stripHtmlTags(text: string): string {
      return text.replace(/<\/?[^>]+(>|$)/g, "");
    }

  }
