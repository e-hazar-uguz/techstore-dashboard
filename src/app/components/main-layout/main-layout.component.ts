import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
currentUser: any = null;
  constructor(private router: Router) {}

    ngOnInit(): void {
    const stored = localStorage.getItem('user');
    this.currentUser = stored ? JSON.parse(stored) : null;
    }

  logOut(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
