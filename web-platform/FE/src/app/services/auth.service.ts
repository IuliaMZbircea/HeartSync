import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLogin());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private checkInitialLogin(): boolean {
    return !!localStorage.getItem('loggedDoctor');
  }

  login(doctor: any) {
    localStorage.setItem('loggedDoctor', JSON.stringify(doctor));
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('loggedDoctor');
    this.isLoggedInSubject.next(false);
  }
}
