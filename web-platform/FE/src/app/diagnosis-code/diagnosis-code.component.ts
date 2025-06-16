import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, of, switchMap} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {IcdService} from "../../services/diagnosis.code.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-diagnosis-code',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    HttpClientModule
  ],
  templateUrl: './diagnosis-code.component.html',
  styleUrl: './diagnosis-code.component.css'
})

export class DiagnosisCodeComponent {
  diseaseControl = new FormControl('');
  icdCode: string = '';
  suggestions: any[] = [];
  token='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDk2MzY0ODgsImV4cCI6MTc0OTY0MDA4OCwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl9mZjlkOTVmZS04MGEyLTQ5NmMtYjI0YS1jMDVkNzE0YTY1NTUiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.bDvwKAo25eslrSmqBe1txM5p5Hsh5pItKn1Ihm8ti2nbYV0lyb1OoS-2ySkgYi-ROzGdf_kba5nOMeBo1tN2TIFT3D70fth1sYB3mC10j42vfFDONKWDyAZVgsrmZ1MPzez4W4C6iUwoleC6JyrNoEpgmU71QUhwysL9kW1a6t35AfqdW0jIF7-oR015e0erLohDR4qZcgISnMCeqZZMvXYGqwJjEc5ZZ2XO4Z5TA-Q-SltZRJm9hqkSyHhwD_4UinVhnrnLTYmmuz0VBp5ZSII2iUOFFMhOfo-xwRdMu4x1BjJ4cdkwQroCfW8LU8lxD88ijcMZT9MZmwGC6HvOgw'
  @Output() diseaseSelected = new EventEmitter<{ title: string; code: string }>();

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

  onSelect(item: any) {
    this.diseaseControl.setValue(item.title, { emitEvent: false });
    this.icdCode = item.code;
    this.suggestions = [];
    this.diseaseSelected.emit({ title: item.title, code: item.code });  // <-- Emit object here
  }

  stripHtmlTags(text: string): string {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
