import { Injectable } from "@angular/core";
import {Recommendation} from "../shared/interfaces/recommendation";
import {environment} from "../shared/env";
import {HttpClient} from "@angular/common/http";
import { ErrorService } from "./error.service";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private apiUrl = `${environment.apiUrl}/api/custom-recommendations`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getRecommendations(): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(this.apiUrl).pipe(
      catchError(error => {
        this.errorService.errorSubject.next('Eroare la încărcarea recomandărilor.');
        return throwError(() => error);
      })
    );
  }

  getRecommendation(id: number): Observable<Recommendation> {
    return this.http.get<Recommendation>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorService.errorSubject.next('Eroare la preluarea recomandării.');
        return throwError(() => error);
      })
    );
  }

  createRecommendation(recommendation: Partial<Recommendation> & { patient: number }): Observable<any> {
    return this.http.post(this.apiUrl, recommendation).pipe(
      catchError(error => {
        this.errorService.errorSubject.next('Eroare la crearea recomandării.');
        return throwError(() => error);
      })
    );
  }

  updateRecommendation(id: number, recommendation: Partial<Recommendation>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, recommendation).pipe(
      catchError(error => {
        this.errorService.errorSubject.next('Eroare la actualizarea recomandării.');
        return throwError(() => error);
      })
    );
  }

  deactivateRecommendation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.errorService.errorSubject.next('Eroare la dezactivarea recomandării.');
        return throwError(() => error);
      })
    );
  }

  getRecommendationsByPatient(patientId: number): Observable<Recommendation[]> {
    const url = `${this.apiUrl}/patient_id/${patientId}`;
    return this.http.get<Recommendation[]>(url).pipe(
      catchError(error => {
        this.errorService.errorSubject.next('Eroare la încărcarea recomandărilor pacientului.');
        return throwError(() => error);
      })
    );
  }
}
