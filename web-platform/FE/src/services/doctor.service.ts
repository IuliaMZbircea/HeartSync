import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Doctor } from '../shared/interfaces/doctor';
import { environment } from '../shared/env';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<any>(`${this.apiUrl}/custom-doctors`).pipe(
      map(response => response.member || []),
      catchError(error => {
        const errorMsg = error?.error?.message || 'Eroare la încărcarea doctorilor.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

  deactivateDoctor(doctorId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/doctors/${doctorId}/deactivate`, {}).pipe(
      catchError(error => {
        const errorMsg = error?.error?.error || 'Eroare la dezactivarea doctorului.';
        this.errorService.errorSubject.next(errorMsg);
        return throwError(() => error);
      })
    );
  }

}
