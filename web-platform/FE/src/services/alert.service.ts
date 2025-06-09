import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

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
}
