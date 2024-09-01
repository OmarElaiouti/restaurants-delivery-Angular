import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:7278/api';

  constructor(private http: HttpClient) {
  }


  submitOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order/confirm`, order);
  }

  
}
