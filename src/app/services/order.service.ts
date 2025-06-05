import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/oder.model';


interface OrderResponse {
  carts: Order[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly url = 'https://dummyjson.com/carts';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(this.url);
  }
}
