import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UserRegisterPayload {
  username: string;
  email: string;
  password: string;
  company_name: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  company_name: string;
  company_logo?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://127.0.0.1:8000/users/';
  private readonly storageKey = 'aurastock_user';

  constructor(private http: HttpClient) {}

  register(userData: UserRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}register`, userData);
  }

  login(credentials: UserLoginPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}login`, credentials).pipe(
      tap((user) => this.saveSession(user))
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}forgot-password`, { email });
  }

  resetPassword(token: string, new_password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}reset-password`, { token, new_password });
  }

  updateLogo(userId: number, companyLogo: string): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}${userId}/logo`, { company_logo: companyLogo }).pipe(
      tap((user) => this.saveSession(user))
    );
  }

  saveSession(user: UserResponse): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  getSession(): UserResponse | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  }
}
