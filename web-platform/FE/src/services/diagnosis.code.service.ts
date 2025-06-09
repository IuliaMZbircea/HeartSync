import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})export class IcdService {
  private apiUrl = 'https://id.who.int/icd/release/11/2022-02/mms/search';

  constructor(private http: HttpClient) {}

  searchDisease(term: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'api-version': 'v2',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}?q=${encodeURIComponent(term)}&flatResults=true`;

    return this.http.get(url, { headers });
  }
}
