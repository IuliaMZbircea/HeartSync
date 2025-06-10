import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {AuditService} from "../../../services/audit.service";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-audit-patient',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    UpperCasePipe,
    NgClass
  ],
  providers: [DatePipe],
  templateUrl: './audit-patient.component.html',
  styleUrl: './audit-patient.component.css'
})
export class AuditPatientComponent implements OnInit {
  auditLogs: any[] = [];
  isLoading = false;
  currentEntity = 'patient';
  availableEntities: string[] = [];
  objectKeys = Object.keys;

  trackByLogId(index: number, log: any): any {
    return log.id || log.object_id || index;
  }
  constructor(
    private auditService: AuditService,
    private datePipe: DatePipe,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadAvailableEntities();
    this.loadAuditLogs(this.currentEntity);
  }

  loadAvailableEntities(): void {
    this.auditService.getAuditedEntities().subscribe({
      next: (response) => {
        this.availableEntities = response.available_entities;
      },
      error: (err) => {
        this.alertService.error('Error loading entities');
      }
    });
  }

  loadAuditLogs(entity: string): void {
    this.isLoading = true;
    this.currentEntity = entity;
    this.auditLogs = [];

    this.auditService.getEntityAuditLogs(entity).subscribe({
      next: (response: any) => {
        this.auditLogs = response[entity].map((log: any) => ({
          ...log,
          parsedDiffs: this.parseDiffs(log.diffs),
          formattedDate: this.formatDate(log.created_at)
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        this.alertService.error('Error loading audit logs:');
        this.isLoading = false;
      }
    });
  }

  private parseDiffs(diffsString: string): any {
    try {
      const diffs = JSON.parse(diffsString);
      const result: any = {};

      Object.keys(diffs).forEach(key => {
        if (!key.startsWith('@') && key !== 'patient') {
          if (typeof diffs[key] === 'object' && diffs[key] !== null) {
            if (diffs[key].new !== undefined || diffs[key].old !== undefined) {
              result[key] = diffs[key];
            }
          }
        }
      });

      return result;
    } catch (e) {
      return { error: 'Failed to parse changes' };
    }
  }

  private formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'medium') || '';
  }

  getActionColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'insert': return 'success';
      case 'update': return 'warning';
      case 'delete': return 'danger';
      default: return 'info';
    }
  }

}
