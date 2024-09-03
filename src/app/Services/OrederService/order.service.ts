import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { PopupService } from '../PopupService/popup.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:7278/api';

  constructor(private http: HttpClient,private popupService: PopupService) {
  }


  submitOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order/confirm`, order).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { 
          this.popupService.showLogin();
        }

        return of(null)
      })
    );
  }

  
}
