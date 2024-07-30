import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://orderdataapi.runasp.net/api';

  constructor(private http: HttpClient) {
  }


  submitOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order/confirm`, order);
  }

  
}
