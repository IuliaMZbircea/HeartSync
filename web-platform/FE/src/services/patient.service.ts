import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../shared/env';
import { ErrorService } from './error.service';
import { Patient } from '../shared/interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/api/custom-patients`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la încărcarea pacienților.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Pacientul nu a fost găsit.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  createPatient(patientData: Partial<Patient>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, patientData).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la crearea pacientului.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  updatePatient(id: number, updatedPatient: Partial<Patient>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedPatient).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la actualizarea pacientului.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la ștergerea pacientului.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  addDisease(diseaseData: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/custom-diseases', diseaseData);
  }
}
