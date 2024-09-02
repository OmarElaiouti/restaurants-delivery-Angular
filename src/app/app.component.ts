import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterOutlet } from '@angular/router';
import { PreloaderService } from './Services/preloaderService/preloader.service';
import { CommonModule } from '@angular/common';
import { ILoginDto, IRegisterDto } from './Models/AuthModels';
import { AuthService } from './Services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
import { PopupService } from './Services/PopupService/popup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  showLoginPopup = false;
  showSignUpPopup = false;
  loginModel: ILoginDto = { email: '', password: '' };
  registerModel: IRegisterDto = { username: '', email: '', password: '' , confirmPassword: '' };

  loginError: string | null = null;
  registerError: string | null = null;
  private destroy$ = new Subject<void>();
  isAuthenticated: boolean = false;

  constructor(
    private preloader: PreloaderService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private popupService: PopupService
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.preloader.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.preloader.hide();
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authService.authStatus$.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.isAuthenticated = status;
    });

    this.popupService.showLoginToContinue$.pipe(takeUntil(this.destroy$)).subscribe(show => {
      this.showLoginPopup = show;
    });
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    this.preloader.show();
  }

  switchtoLoginPopup() {
    this.clearErrors();
    this.popupService.showLogin();
    this.showSignUpPopup = false;
    
  }

  switchtoSigupPopup() {
    this.clearErrors();
    this.popupService.hideLogin();
    this.showSignUpPopup = true;
    
  }

  closeModals() {
    this.showLoginPopup = false;
    this.showSignUpPopup = false;
    this.clearErrors();
  }

  clearErrors() {
    this.registerError = null;
    this.loginError = null;
  }

  onLogin() {
    this.authService.login(this.loginModel).pipe(
      catchError(error => {
        this.loginError = error;
        return of(null); // Return a default observable to keep the stream alive
      })
    ).subscribe(response => {
      if (response) {
        this.loginError = null;
        this.closeModals();
        this.isAuthenticated = true; // Notify of successful login
      }
    });
  }

  onRegister() {
    this.authService.register(this.registerModel).pipe(
      catchError(error => {
        this.registerError = error;
        return of(null); // Return a default observable to keep the stream alive
      })
    ).subscribe(response => {
      if (response) {
        this.registerError = null;
        this.closeModals();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false; // Notify of successful logout
    this.closeModals();
  }

  ngOnDestroy(): void {
    // Emit a value to clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
