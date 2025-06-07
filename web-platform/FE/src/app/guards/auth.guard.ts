import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const doctor = localStorage.getItem('loggedDoctor');

  if (doctor) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
