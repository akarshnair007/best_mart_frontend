import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-whishlist',
  templateUrl: './whishlist.component.html',
  styleUrls: ['./whishlist.component.css'],
})
export class WhishlistComponent implements OnInit {
  allWishListProduct: any = [];
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getWishListProducts();
  }

  getWishListProducts() {
    this.api.getWishListApi().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allWishListProduct = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  removeItem(id: any) {
    this.api.removeItemWishListApi(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getWishListProducts();
        this.api.getWishListCount();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  addToCart(item: any) {
    Object.assign(item, { quantity: 1 });
    this.api.addToCartApi(item).subscribe({
      next: (res: any) => {
        console.log(res);
        alert('Product added to Cart Successfully');
        this.api.getCartCount();
        this.removeItem(item._id);
      },
      error: (err: any) => {
        if (err.error == 'Product already in cart') {
          alert('Product added successfully');
          this.removeItem(item._id);
        } else {
          alert(err.error);
          console.log(err);
        }
      },
    });
  }
}
