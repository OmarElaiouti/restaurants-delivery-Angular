import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ICity } from '../../Models/ICity';
import { IRestaurant } from '../../Models/IRestaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private apiUrl = 'https://localhost:7278/api';

  constructor(private http: HttpClient) { }

  getCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(`${this.apiUrl}/restaurants/cities`).pipe(
      catchError(this.handleError)
    );
  }

  getRestaurantsByCity(cityId: number): Observable<IRestaurant[]> {
    return this.http.get<IRestaurant[]>(`${this.apiUrl}/Restaurants/bycity?cityId=${cityId}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllRestaurantsByCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(`${this.apiUrl}/Restaurants/cities-with-restaurants`).pipe(
    
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    
    // Return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');


}

}
