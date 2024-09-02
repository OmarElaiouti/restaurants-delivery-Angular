import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('authToken');

  // Clone the request and attach the token to the headers if available
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};
