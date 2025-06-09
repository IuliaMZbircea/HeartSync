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
  token='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDkxMzg2NzMsImV4cCI6MTc0OTE0MjI3MywiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl81NGIzZmZiNC1jMjc3LTQ0NDItYTUyZi0yMDY3YmRkNTM3NzQiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.nVvYYkrlr7UP555CpTpZjU9mZ9Fux53oIRA9hwKagjLRln-bbnvRqLdJBBdRyYl5DuISCOeUg_uIwbUiH-WUjZsKJ3TeZCLfp_VrdMTKhmB8Zils5uUTEY0rl0k7L-4KYhs-93FPZcCKUVoFVdIRIS1VPiw8VT6BUy2ADaaUaQog9-nIfE3QC6ubSvgV4qCW-v1Gc6o-kV3ZucgoOwAfntsSfDLjmcw1Irv05XbFDlL22MWs8R--AUaq_pKHEjMOm7cDoPwMz7zgiBJTolbEBg_WzXPQpsFFQOuezs3E6_u3XI820Dv9al8O94zWVgoqfAIS0mnfFDmsrrpmTkI6TQ'
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
