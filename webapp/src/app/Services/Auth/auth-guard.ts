import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { clearSession, isAccessTokenValid } from './auth-session';

export const authGuard: CanActivateFn = () => {
  if (isAccessTokenValid()) {
    return true;
  }

  clearSession();
  return inject(Router).createUrlTree(['/login']);
};
