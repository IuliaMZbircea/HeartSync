import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IcdService} from "../services/diagnosis.code.service";
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
  token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDkwNTU2MTIsImV4cCI6MTc0OTA1OTIxMiwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl81NGIzZmZiNC1jMjc3LTQ0NDItYTUyZi0yMDY3YmRkNTM3NzQiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.I4TEDzKDYAMVuaXA3LAysOYuK30s1sgy8iiHhYoMlrkpKKfv-GF1hgUrCY_g2wO-Z2Lq3vGnTPUD85_mKzfIIk6LByWF6MgN52MACn00chayUb897JKOooeqDkClOpl23lXrfvRtrpOfIqbROyoAeKK2pGy5wCUnhihl7Ib9pS9p-RryTEJn1oY3Gu8G-QlnCI4qYuTG8Qze8wTziWvOvDfChMzVWig2PU46kodXdu7ZqzJGxipaMD_6B_Jt7S0b3FQzzZ_pnLxu4wZkS0VF7OSAWAf-6jjpF5AR6dy0kSA_H5HCtw2U7p8VjN-EbCyWT42o3Ft6IddPQel-ks0mGA'
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
