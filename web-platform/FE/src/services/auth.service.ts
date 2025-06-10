import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from '../shared/env';
import {BehaviorSubject, catchError, map, Observable, switchMap, throwError} from 'rxjs';
import {Doctor, DoctorI} from "../shared/interfaces/doctor";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  private apiUrl = `${environment.apiUrl}`;
  private currentUser: DoctorI = new Doctor();
  currentUserSubject = new BehaviorSubject<Doctor>(new Doctor());
  currentUser$: Observable<DoctorI> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient,
              private errorService: ErrorService) {

  }

  registerUser(userPayload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Observable<Doctor> {
    return this.http.post<any>(`${this.apiUrl}/doctors`, userPayload).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          return response.token;
        }
        else {
          this.errorService.errorSubject.next(response.message || 'Authentication failed.');
        }
      }),
      switchMap(token => this.fetchCurrentUser()),

      catchError(error => {
        const errorMessage = error?.error?.message || error?.message || 'Registration failed.';
        this.errorService.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }

  loginUser(email: string, password: string): Observable<DoctorI> {
    return this.http.post<any>(`${this.apiUrl}/login`, {email, password}).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          return response.token;
        } else {
          this.errorService.errorSubject.next(response.message || 'Authentication failed.');
        }
      }),
      switchMap(token => this.fetchCurrentUser()),
      catchError(error => {
        this.errorService.errorSubject.next(error.error.message || 'Authentication failed.');
        return throwError(error);
      })
    );
  }

  fetchCurrentUser(): Observable<DoctorI> {

    return this.http.get<DoctorI>(`${this.apiUrl}/api/doctors/auth/user`).pipe(
      map(response => {
        this.currentUser = response;
        this.currentUserSubject.next(this.currentUser);
        return this.currentUser;
      }),
      catchError(error => {
        console.error('Error fetching user:', error);
        this.errorService.errorSubject.next(error.error.message || 'Fetching user failed.');
        return throwError(error);
      })
    );
  }

  logout(): Observable<void> {
    return new Observable<void>((observer) => {
      localStorage.removeItem('token');
      this.currentUserSubject.next(new Doctor());
      observer.next();
      observer.complete();
    });
  }


  getCurrentUser(): Observable<DoctorI> {
    if (!this.currentUser.id) {
      return this.fetchCurrentUser().pipe(
        map((response) => {
          this.currentUserSubject.next(response);
          return response;
        }),
        catchError((error) => {
          console.error('Error in getCurrentUser:', error);
          return throwError(error);
        })
      );
    }
    return this.currentUser$;
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      password: newPassword
    }).pipe(
      map(response => {
        this.errorService.errorSubject.next('Password successfully reset.');
        return response;
      }),
      catchError(error => {
        const errorMessage = error?.error?.message || 'Password reset failed.';
        this.errorService.errorSubject.next(errorMessage);
        return throwError(() => error);
      })
    );
  }



}
