import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: { id: number; role: string } | null = null;

  login(userId: number): void {
    const roleMap: { [key: number]: string } = {
      1: 'admin',
      2: 'sales',
      3: 'product-manager'
    };
    const role = roleMap[userId] || 'guest';
    this.currentUser = { id: userId, role };
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): { id: number; role: string } | null {
    if (this.currentUser) return this.currentUser;
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getUserRole(): string | null {
    return this.getCurrentUser()?.role || null;
  }

  constructor(private router: Router) {}
}
