import { Component } from '@angular/core';
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
  token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDkwMzU2MzgsImV4cCI6MTc0OTAzOTIzOCwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl81NGIzZmZiNC1jMjc3LTQ0NDItYTUyZi0yMDY3YmRkNTM3NzQiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.atST8I51yEnHJ3A9KOyn5Df9QYkhFLfl3lOyn_srht0UoEnc8EE7lAaEzHeDWsdHZdpyGwUkSw9kb4KrcmHBSjCRC7d6M1Tbl3-_6usshNebsklxfra0CelUrcZsYc907WHMQqodmMRcfaKuxMksgWGCQ_CbOs1JMblYseHyQwmkHUzZW-d9tjsRFByj5BbM-ZJFBW_oJrA2YIXsP_jJ3Y2D3dm1Y-MpK-ItlVBW-XFoXqwcLyC8Of4sE360tMdjzjdTq4_8quhgI2H4w0WZrQKvEZHYau0dmGT3wxEBGqM7EQPEJt37Medq3OE-Zs0UPsSAENQZWs6yqdK1PovsyA'


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
      this.diseaseControl.setValue(item.title, {emitEvent: false});
      this.icdCode = item.code;
      this.suggestions = [];
    }

    stripHtmlTags(text: string): string {
      return text.replace(/<\/?[^>]+(>|$)/g, "");
    }
  }
