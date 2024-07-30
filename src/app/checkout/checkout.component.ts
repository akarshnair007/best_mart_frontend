import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  paymentStatus: boolean = false;
  grandTotal: any = '';
  payStatus: boolean = false;
  public payPalConfig?: IPayPalConfig;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  checkOutForm = this.fb.group({
    uname: ['', [Validators.required, Validators.pattern('[a-zA-z ]*')]],
    flat: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9:, ]*')]],
    place: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    pincode: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  });

  cancel() {
    this.checkOutForm.reset();
  }

  confirmAddress() {
    if (this.checkOutForm.valid) {
      this.paymentStatus = true;
      this.grandTotal = sessionStorage.getItem('total');
    } else {
      alert('Please fill the form');
    }
  }
  back() {
    this.paymentStatus = false;
  }
  payment() {
    this.payStatus = true;
    this.initConfig();
  }
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.grandTotal,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.grandTotal,
                  },
                },
              },
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      // transaction
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        //1) empty cart

        this.api.emptyCartApi().subscribe((res: any) => {
          this.api.getCartCount();
          alert('Payment successfull');
          this.paymentStatus = false;
          this.payStatus = false;
          this.router.navigateByUrl('/');
        });
      },

      // transaction cancel
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        alert('Payment cancelled');
        this.paymentStatus = false;
      },

      // gateway issue
      onError: (err) => {
        console.log('OnError', err);
        alert('Paymant failed, Please try after sometimes');
        this.paymentStatus = true;
      },

      // button click
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}

//Dummy paypal account

// Email
// sb-smojx31831266@business.example.com

// Password
// MvW1m+n@
