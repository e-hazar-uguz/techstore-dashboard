
import { CanActivateFn, Router } from '@angular/router';

export const AuthGard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return redirectToLogin();

    try {
      const user = JSON.parse(userStr);
      const hasAccess = allowedRoles.includes(user.role);

      return hasAccess ? true : redirectToUnauthorized();
    } catch {
      return redirectToLogin();
    }
  };
};

function redirectToLogin() {
  window.location.href = '/login';
  return false;
}

function redirectToUnauthorized() {
  window.location.href = '/unauthorized';
  return false;
}
