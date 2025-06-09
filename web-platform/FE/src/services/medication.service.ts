import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Medication } from '../shared/interfaces/medication';
import { environment } from '../shared/env';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  private apiUrl = `${environment.apiUrl}/api/custom-medications`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}
  getMedicationsByPatient(patientId: number): Observable<Medication[]> {
    const url = `${this.apiUrl}/patient_id/${patientId}`;
    console.log('Fetching meds from:', url);
    return this.http.get<Medication[]>(url).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la încărcarea medicației.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }


  getMedication(id: number): Observable<Medication> {
    return this.http.get<Medication>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la preluarea detaliilor medicației.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  createMedication(medication: Partial<Medication> & { patient_id: number }): Observable<any> {
    return this.http.post(this.apiUrl, medication).pipe(
      catchError(error => {
        const errorMsg = error?.error?.error || 'Eroare la crearea medicației.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  updateMedication(id: number, medication: Partial<Medication>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, medication).pipe(
      catchError(error => {
        const errorMsg = error?.error?.error || 'Eroare la actualizarea medicației.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  deactivateMedication(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.error || 'Eroare la dezactivarea medicației.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }
}
