import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  visitedNews:any[]=[];
  
  private readonly tokenKey = 'auth_token';
  

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);

  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/staging']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  // getUserId(): string | null {
  //   return localStorage.getItem(this.userIdKey);
  // }


  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }



  // getUserId(): string | null {
  //   return localStorage.getItem(this.userIdKey);
  // }

  setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }
  private userIdKey = 'user_id';

}
