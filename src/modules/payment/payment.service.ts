import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { format } from 'date-fns-tz';
import * as qs from 'qs';

@Injectable()
export class PaymentService {
    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        ) {}
  private vnp_TmnCode = '7GWZMJAH';
  private vnp_HashSecret = 'VKFSELIYNFVOCAFUHJDVDGZNUVAFWBWW';
  private vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

  generateVnpayUrl(customerId: number, amount: number): string {
    let vnp_CreateDate = format(new Date(), 'yyyyMMddHHmmss', { timeZone: 'Asia/Bangkok' });
    let vnp_Params:object = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Locale: 'en',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: Math.random().toString(36).substring(7),
      vnp_OrderInfo: "PaymentForOrder",
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPAY expects amount in VNĐ, so multiply by 100
      vnp_ReturnUrl: 'http://localhost:3001/paymentStatus',
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: Number(vnp_CreateDate),
    };

    // Sort parameters by key
    // Thêm hàm sortObject để sắp xếp tham số
    function sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
  
    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", this.vnp_HashSecret);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;

    // Append the secure hash to the querystring
    const vnpayUrl = `${this.vnp_Url}?` + querystring.stringify(vnp_Params, { encode: false });
console.log(vnpayUrl)
    return vnpayUrl;
  }


async processPayment(
    customerId: number,
    products: { productId: number; quantity: number }[],
    paymentMethod: string,
    vnp_ResponseCode: string, // Assume you get this from VNPAY callback
  ): Promise<void> {
    try {
      // Check if payment is successful
      if (vnp_ResponseCode === '00') {
        await this.orderService.createOrder(customerId, products, paymentMethod)
      } else {
        console.error('Payment failed');
      }
    } catch (error) {
      console.error(`Failed to process payment: ${error.message}`);
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }
}