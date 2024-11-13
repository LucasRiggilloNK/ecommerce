import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/login/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  name: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.name = this.authService.getUserName();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.name = null;
  }
}
