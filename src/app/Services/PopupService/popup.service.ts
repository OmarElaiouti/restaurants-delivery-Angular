import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private showLoginPopupSubject = new Subject<boolean>();
  showLoginToContinue$ = this.showLoginPopupSubject.asObservable();

  showLogin() {
    this.showLoginPopupSubject.next(true);
  }

  hideLogin() {
    this.showLoginPopupSubject.next(false);
  }
}
