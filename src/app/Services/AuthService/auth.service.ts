import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginDto, IRegisterDto } from '../../Models/AuthModels';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `https://localhost:7278/auth`; // Adjust the API URL if needed
  private tokenKey = 'authToken';
  private currentUserSubject = new BehaviorSubject<any>(null);
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = sessionStorage.getItem(this.tokenKey);
    if (token) {
      this.currentUserSubject.next(token);
    }
  }

  register(model: IRegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, model).pipe(
      catchError(this.handleError)
    );
  }

  login(model: ILoginDto): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, model).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.authStatusSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.authStatusSubject.next(false);
    this.router.navigate(['/']); 
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    this.currentUserSubject.next(token);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    
      if (error.status === 400) {
        // Handle validation errors
        errorMessage = `Please enter valid data`;
      } else {
        errorMessage = `Faild to process your request, please try again`;
      }
    
    return throwError(errorMessage);
  }
}
