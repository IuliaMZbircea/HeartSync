import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../shared/env';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = `${environment.apiUrl}/api/audit/modifications`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getAuditedEntities(): Observable<{available_entities: string[]}> {
    return this.http.get<{available_entities: string[]}>(this.apiUrl).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Error loading audited entities.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  getEntityAuditLogs(entity: string, limit: number = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${entity}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || `Error loading audit logs for ${entity}.`;
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  // Specific entity methods following your request
  getAllergyAuditLogs(limit: number = 10): Observable<any[]> {
    return this.getEntityAuditLogs('allergy', limit);
  }

  getPatientAuditLogs(limit: number = 10): Observable<any[]> {
    return this.getEntityAuditLogs('patient', limit);
  }

  getReferralAuditLogs(limit: number = 10): Observable<any[]> {
    return this.getEntityAuditLogs('referral', limit);
  }

  // Add more specific entity methods as needed...
}
