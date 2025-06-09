import { HttpInterceptorFn } from '@angular/common/http';

export const CustomInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // NU adăuga Authorization pentru /login sau /register
  const excludedUrls = ['/login', '/register'];

  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (token && !isExcluded) {
    const cloneRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloneRequest);
  }

  // dacă nu ai token sau e ruta exclusă, trimite cererea originală
  return next(req);
};
