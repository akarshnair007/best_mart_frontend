import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // serverUrl = 'http://localhost:3000';

  serverUrl = 'https://best-mart-backend.onrender.com';
  wishlistcount = new BehaviorSubject(0);
  cartCount = new BehaviorSubject(0);
  searchKey = new BehaviorSubject('');

  constructor(private http: HttpClient) {
    this.getWishListCount();
    this.getCartCount();
  }

  getAllProductApi() {
    return this.http.get(`${this.serverUrl}/all-product`);
  }
  registerApi(reqBody: any) {
    return this.http.post(`${this.serverUrl}/register`, reqBody);
  }
  loginApi(reqBody: any) {
    return this.http.post(`${this.serverUrl}/login`, reqBody);
  }
  addHeaderToRequest() {
    let headers = new HttpHeaders();
    let token = sessionStorage.getItem('token');
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }
    return { headers };
  }
  addWishListApi(reqBody: any) {
    return this.http.post(
      `${this.serverUrl}/add-wishlist`,
      reqBody,
      this.addHeaderToRequest()
    );
  }
  getWishListApi() {
    return this.http.get(
      `${this.serverUrl}/get-wishlist`,
      this.addHeaderToRequest()
    );
  }
  removeItemWishListApi(id: any) {
    return this.http.delete(`${this.serverUrl}/delete-wishlist/${id}`);
  }
  viewProductApi(id: any) {
    return this.http.get(`${this.serverUrl}/view-product/${id}`);
  }
  getWishListCount() {
    this.getWishListApi().subscribe({
      next: (res: any) => {
        this.wishlistcount.next(res.length);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  addToCartApi(reqBody: any) {
    return this.http.post(
      `${this.serverUrl}/add-cart`,
      reqBody,
      this.addHeaderToRequest()
    );
  }
  getcartItemApi() {
    return this.http.get(
      `${this.serverUrl}/get-cart`,
      this.addHeaderToRequest()
    );
  }
  removeItemCartApi(id: any) {
    return this.http.delete(`${this.serverUrl}/delete-cart/${id}`);
  }
  emptyCartApi() {
    return this.http.delete(
      `${this.serverUrl}/empty-cart`,
      this.addHeaderToRequest()
    );
  }
  getCartCount() {
    this.getcartItemApi().subscribe({
      next: (res: any) => {
        this.cartCount.next(res.length);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  incrementCartItem(id: any) {
    return this.http.get(`${this.serverUrl}/cart/increment/${id}`);
  }
  decrementCartItem(id: any) {
    return this.http.get(`${this.serverUrl}/cart/decrement/${id}`);
  }
  getSearchKey(value: any) {
    this.searchKey.next(value);
  }
}
