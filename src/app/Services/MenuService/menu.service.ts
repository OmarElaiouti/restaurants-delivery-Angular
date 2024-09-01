import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IMenuItem } from '../../Models/IMenuItem';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://localhost:7278/api';

  getMenuItems(restaurantId: number): Observable<IMenuItem[]> {
    if (restaurantId <= 0) {
      return throwError('Invalid restaurant ID');
    }

    return this.http.get<IMenuItem[]>(`${this.apiUrl}/menu/${restaurantId}`)
      .pipe(
        catchError(this.handleError)
      );
  }


  getMenuItemDetails(itemId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/menu/byId?itemId=${itemId}`)
    .pipe(
      catchError(this.handleError)

    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    return throwError('Something went wrong; please try again later.');
  }
}
