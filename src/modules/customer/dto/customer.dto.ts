import { Cart } from "src/modules/cart/entity/cart.entity";

export class NewCustomer {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  cart: Cart
}

export class UpdateCustomerDto {
  username: string;
  name: string;
  email: string;
  phonenumber: string;
  address: string;
}


export class UpdateCustomerWithNewUsernameDto {
  oldUsername: string;
  newUsername: string;
  name: string;
  email: string;
  phonenumber: string;
  address: string;
}