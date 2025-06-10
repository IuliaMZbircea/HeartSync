import { Injectable } from "@angular/core";
import {environment} from "../shared/env";
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ErrorService} from "./error.service";
import {Referral} from "../shared/interfaces/referral";

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private apiUrl = `${environment.apiUrl}/api/custom-referrals`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getReferralsByPatient(patientId: number): Observable<Referral[]> {
    return this.http.get<Referral[]>(`${this.apiUrl}/patient_id/${patientId}`).pipe(
      catchError(error => this.handleError(error, 'Eroare la încărcarea trimiterilor.'))
    );
  }

  getReferralById(referralId: number): Observable<Referral> {
    return this.http.get<Referral>(`${this.apiUrl}/${referralId}`).pipe(
      catchError(error => this.handleError(error, 'Eroare la încărcarea trimiterii.'))
    );
  }

  createReferral(referral: Partial<any>): Observable<Referral> {
    return this.http.post<Referral>(this.apiUrl, referral).pipe(
      catchError(error => this.handleError(error, 'Eroare la crearea trimiterii.'))
    );
  }

  updateReferral(referralId: number, referral: Partial<Referral>): Observable<Referral> {
    return this.http.put<Referral>(`${this.apiUrl}/${referralId}`, referral).pipe(
      catchError(error => this.handleError(error, 'Eroare la actualizarea trimiterii.'))
    );
  }

  deactivateReferral(referralId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${referralId}`).pipe(
      catchError(error => this.handleError(error, 'Eroare la dezactivarea trimiterii.'))
    );
  }

  private handleError(error: any, defaultMessage: string): Observable<never> {
    const errorMsg = error?.error?.error || defaultMessage;
    this.errorService.errorSubject.next(errorMsg);
    return throwError(() => error);
  }
}
