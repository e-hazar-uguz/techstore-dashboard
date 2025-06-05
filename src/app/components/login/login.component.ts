import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router,    private toastr: ToastrService) {}

  login() {
    this.http.get<any>('https://dummyjson.com/users').subscribe(res => {
      const user = res.users.find((u: any) => u.username === this.username && u.password === this.password);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigateByUrl('/');
        this.toastr.success('User login successful')
      } else {
           this.toastr.error('Username or password is incorrect, please try again.');
      }
    });
  }
}
