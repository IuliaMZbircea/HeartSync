import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, catchError, map } from 'rxjs';
import { Allergy } from '../shared/interfaces/allergies';
import { environment } from '../shared/env';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AllergyService {

  private apiUrl = `${environment.apiUrl}/api/custom-allergies`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getAllergiesByPatient(patientId: number): Observable<Allergy[]> {
    return this.http.get<Allergy[]>(`${this.apiUrl}/patient/${patientId}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la încărcarea alergiilor.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  createAllergy(allergy: Partial<Allergy> & { patient_id: number }): Observable<any> {
    return this.http.post(this.apiUrl, allergy).pipe(
      catchError(error => {
        const errorMsg = error?.error?.error || 'Eroare la crearea alergiei.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  updateAllergy(allergyId: number, allergy: Partial<Allergy>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${allergyId}`, allergy).pipe(
      catchError(error => {
        const errorMsg = error?.error?.error || 'Eroare la actualizarea alergiei.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  deactivateAllergy(allergyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${allergyId}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.error || 'Eroare la dezactivarea alergiei.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }
}
