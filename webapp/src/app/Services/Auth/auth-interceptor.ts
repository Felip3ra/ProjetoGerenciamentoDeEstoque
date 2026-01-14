// auth-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { getAccessToken } from './auth-session';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getAccessToken();
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(authReq);
};
