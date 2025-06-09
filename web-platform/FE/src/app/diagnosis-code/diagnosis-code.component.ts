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
  token='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDk1MDk2NzEsImV4cCI6MTc0OTUxMzI3MSwiaXNzIjoiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQiLCJhdWQiOlsiaHR0cHM6Ly9pY2RhY2Nlc3NtYW5hZ2VtZW50Lndoby5pbnQvcmVzb3VyY2VzIiwiaWNkYXBpIl0sImNsaWVudF9pZCI6IjQwMDYxMDkyLTZhYjktNGI5OC04ZWI3LWJmMGM1YzU0MWE2Zl9mZjlkOTVmZS04MGEyLTQ5NmMtYjI0YS1jMDVkNzE0YTY1NTUiLCJzY29wZSI6WyJpY2RhcGlfYWNjZXNzIl19.H-oYxiwm5AGZxtsAdB-KAiuiA3aLnheAy_kDJGSZM8XH6hegiFUijL4Yfwg4BHLaJRH87O8E9_DZi62WTrYLiDowpJMMLkldNuvEnv8jpYxig93JjSs3qihky2orGv0BdT5V58sNmxkMCol-PohzotKRMtDLQqX2EXE745deB9JwUY71gxlN17PsP163GWxmaXyy5vVrtYZ6BjQ1MNmAhEgelVcO5kyr3sMtvVniYtbKRbz5hXazKjb6JdqhutFgLYm0WJlWM2qu2aG2PzP3xRyR_lgQPFDHVObgpkYdX-qt5c9eAJQPxj4rgm0AjV6ycT-XUPVJzopP3lDvPtymlQ'
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
