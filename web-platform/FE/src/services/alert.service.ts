import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class AlertService {
  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success ✅',
      text: message,
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      position: 'top-end',
    });
  }

  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops! ❌',
      text: message,
    });
  }

  private apiUrl = 'http://localhost:8000/api/alarms';

  constructor(private http: HttpClient) {}

  getAlarmsByPatient(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  createAlarm(alarmData: any): Observable<any> {
    const url = 'http://localhost:8000/api/thresholds';
    return this.http.post<any>(url, alarmData);
  }

  updateAlarm(id: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8000/api/thresholds/${id}`, updatedData);
  }

  getAlarms(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8000/api/thresholds`);
  }

}
