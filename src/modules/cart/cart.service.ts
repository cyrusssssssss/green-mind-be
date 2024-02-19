import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { CartProduct } from './entity/cartProduct.entity';
import { Customer } from '../customer/entity/customer.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
  ) {}

  async addToCart(customerId: number, productId: number, quantity: number) {
    try {
      // Lấy thông tin khách hàng và sản phẩm
      const customer = await this.customerService.getCustomerById(customerId);
      const product = await this.productService.findProductById(productId);

      if (!customer || !product) {
        throw new Error('Customer or product not found.');
      }

      let cart = await this.cartRepository.findOne({
        where: { customer },
        relations: ['cartProducts'],
      });

      const cartProduct = {
        cart: cart,
        product: product,
        quantity: quantity,
      };

      let cartProducts = await this.cartProductRepository.find({
        where: { cart },
        relations: ['product'],
      });

      if (!cartProducts.length) {
        // Tạo chi tiết sản phẩm trong giỏ hàng
        const newCartProduct = this.cartProductRepository.create({
          cart,
          product,
          quantity,
        });
        cart.cartProducts.push(newCartProduct);
        cartProducts.push(newCartProduct);
        cart.total = cartProducts.reduce(
          (total, p) => total + p.product.price * p.quantity,
          0,
        );

        await this.cartRepository.save(cart);
        cartProduct.cart = cart;
        await this.cartProductRepository.save(cartProduct);
      } else {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cartProducts.find(
          (cartProduct) => cartProduct.product.id == productId,
        );

        if (existingProduct) {
          // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
          let existingProductQuantity = existingProduct.quantity;
          existingProductQuantity += Number(quantity);
          await this.updateCartProductQuantity(
            existingProduct.id,
            existingProductQuantity,
          );

          cart.total =
            Number(quantity) * existingProduct.product.price +
            cartProducts.reduce(
              (total, p) => total + p.product.price * p.quantity,
              0,
            );

          await this.cartRepository.save(cart);
        } else {
          // Tạo chi tiết sản phẩm trong giỏ hàng
          const newCartProduct = this.cartProductRepository.create({
            cart,
            product,
            quantity,
          });
          cart.cartProducts.push(newCartProduct);
          cartProducts.push(newCartProduct);
          cart.total = cartProducts.reduce(
            (total, p) => total + p.product.price * p.quantity,
            0,
          );
          await this.cartRepository.save(cart);
          cartProduct.cart = cart;
          await this.cartProductRepository.save(cartProduct);
        }
      }

      return cart;
    } catch (error) {
      console.log(`Failed to add product to cart: ${error.message}`);
      throw new Error(`Failed to add product to cart: ${error.message}`);
    }
  }

  async createCart(customer: Customer) {
    try {
      if (!customer) {
        throw new Error('Customer not found.');
      }
      let cart = await this.cartRepository.create({
        customer,
        cartProducts: [],
      });
      await this.cartRepository.save(cart);
      return cart;
    } catch (error) {
      console.log(`Failed to creat cart: ${error.message}`);
      throw new Error(`Failed creat cart: ${error.message}`);
    }
  }

  async getCartByCustomer(customer: Customer) {
    try {
      if (!customer) {
        throw new Error('Customer not found.');
      }
      let cart = await this.cartRepository.findOneBy(customer);
      return cart;
    } catch (error) {
      console.log(`Failed to creat cart: ${error.message}`);
      throw new Error(`Failed creat cart: ${error.message}`);
    }
  }

  async getCart(customerId: number) {
    try {
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found.');
      }

      let cart = await this.cartRepository.findOne({
        where: { customer },
        relations: ['cartProducts'],
      });
      if (!cart) {
        throw new Error('Cart not found.');
      }

      let cartProducts = await this.cartProductRepository.find({
        where: { cart },
        relations: ['product'],
      });

      return cartProducts;
    } catch (error) {
      console.log(`Failed to get cart: ${error.message}`);
      throw new Error(`Failed to get cart: ${error.message}`);
    }
  }

  async updateCartProductQuantity(id: number, quantity: number) {
    const cartProduct = await this.cartProductRepository.findOne({
      where: { id },
    });
    if (!cartProduct) {
      console.log('Product not found in cart');
      throw new Error('Product not found in cart');
    }
    cartProduct.quantity = quantity;
    const updated = await this.cartProductRepository.save(cartProduct);
    return updated;
  }

  async findCartProductByProductId(
    id: number,
  ): Promise<CartProduct | undefined> {
    return await this.cartProductRepository.findOne({ where: { id } });
  }

  async clearCart(customerId: number): Promise<Cart> {
    try {
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found.');
      }

      let cart = await this.cartRepository.findOne({
        where: { customer },
        relations: ['cartProducts'],
      });
      if (!cart) {
        throw new Error('Cart not found.');
      }

      cart.cartProducts = [];
      cart.total = 0;
      await this.cartRepository.save(cart);

      return cart;
    } catch (error) {
      console.log(`Failed to clear cart: ${error.message}`);
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  async removeCartItemByProductId(
    customerId: number,
    productId: number,
  ): Promise<void> {
    try {
      const customer = await this.customerService.getCustomerById(customerId);
      const product = await this.productService.findProductById(productId);
      if (!customer || !product) {
        throw new Error('Customer or product not found.');
      }

      const cart = await this.cartRepository.findOne({
        where: { customer },
        relations: ['cartProducts'],
      });
      if (!cart) {
        throw new Error('Cart not found.');
      }

      let cartProducts = await this.cartProductRepository.find({
        where: { cart },
        relations: ['product'],
      });

      const productIndex = cartProducts.findIndex(
        (product) => product.product.id == productId,
      );
      if (productIndex >= 0) {
        cartProducts.splice(productIndex, 1); // Xóa sản phẩm khỏi mảng cartProducts
        cart.total = cartProducts.reduce(
          (total, p) => total + p.product.price * p.quantity,
          0,
        ); // Cập nhật tổng giá trị của giỏ hàng
        await this.cartRepository.save(cart);
        await this.cartProductRepository.remove(
          cart.cartProducts[productIndex],
        );
      }
    } catch (error) {
      console.log(`Failed to clear cart: ${error.message}`);
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }
}
