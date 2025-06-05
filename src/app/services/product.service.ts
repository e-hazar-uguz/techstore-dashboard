import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";
import { Observable } from "rxjs";
import { Category } from "../models/category.model";

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(limit = 100, skip = 0): Observable<ProductResponse> {
    const params = new HttpParams().set('limit', limit).set('skip', skip);
    return this.http.get<ProductResponse>(this.baseUrl, { params });
  }

  searchProducts(query: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/search?q=${query}`);
  }

  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/category/${category}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  addProduct(product: Partial<Product>): Observable<Product> {
  return this.http.post<Product>(`${this.baseUrl}/add`, product);
}

updateProduct(id: number, productData: Partial<Product>) {
  return this.http.put<Product>(`https://dummyjson.com/products/${id}`, productData);
}


}
