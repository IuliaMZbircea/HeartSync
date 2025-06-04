import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IcdService {
  private apiUrl = 'https://id.who.int/icd/release/11/2022-02/mms/search';

  constructor(private http: HttpClient) {

  }

  searchDisease(query: string, token: string): Observable<any> {
    if (!query.trim()) {
      return of({ destinationEntities: [] });
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'API-Version': 'v2'
    });

    return this.http.get(`${this.apiUrl}?q=${encodeURIComponent(query)}`, { headers });
  }
}
