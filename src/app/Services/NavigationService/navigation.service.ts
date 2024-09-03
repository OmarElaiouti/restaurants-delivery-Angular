import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private router: Router) {
  
    
  }

  getPreviousUrl(): string | null {
    return this.previousUrl;
  }

  setCurrentUrl(url: string): void {
    this.currentUrl = url;
    this.previousUrl = this.currentUrl;

  }

  getCurrentUrl(): string | null {
    return this.currentUrl;
  }
}

