import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductPayload {
  name: string;
  description?: string | null;
  net_price: number;
  iva_percentage: number;
  stock_quantity: number;
}

export interface Product extends ProductPayload {
  id: number;
  gross_price: number;
}

export interface ProductImportResult {
  created: number;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /** Backend FastAPI (uvicorn) — sidecar en producción, mismo host en desarrollo */
  private readonly apiUrl = `${environment.apiUrl}/products/`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  createProduct(productData: ProductPayload): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData);
  }

  updateProduct(id: number, productData: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${id}`, productData);
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}${id}`);
  }

  importProducts(products: ProductPayload[]): Observable<ProductImportResult> {
    return this.http.post<ProductImportResult>(`${this.apiUrl}import`, { products });
  }
}
