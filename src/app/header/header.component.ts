import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  wishCount: number = 0;
  cartCount: number = 0;
  username: any = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      const exisitingUser = JSON.parse(
        sessionStorage.getItem('exisitingUser') as string
      );
      this.username = exisitingUser.username;
      console.log(this.username);
      this.api.wishlistcount.subscribe((res: any) => {
        this.wishCount = res;
      });
      this.api.cartCount.subscribe((res: any) => {
        this.cartCount = res;
      });
    }
  }

  getSearch(value: any) {
    this.api.getSearchKey(value);
  }

  logout() {
    this.username = '';
    sessionStorage.removeItem('total');
    sessionStorage.removeItem('exisitingUser');
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/');
  }
}
