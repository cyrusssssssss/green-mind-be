import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
    Body,
    Param,
    NotFoundException,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  
  @Controller('cart')
  export class CartController {
    constructor(private readonly cartService: CartService) {}
      @Post(':customerId/addToCart/:productId/:quantity')
      async addToCart(
        @Param('customerId') customerId: number,
        @Param('productId') productId: number,
        @Param('quantity') quantity: number,
      ) {
        try {
          const result = await this.cartService.addToCart(customerId, productId, quantity);
          return { message: 'Product added to cart successfully' };
        } catch (error) {
          throw new HttpException('An error occurred while adding the product to cart', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      @Delete(':customerId')
      async deleteAllProductsFromCart(
        @Param('customerId') customerId: number,
      ) {
        try {
          await this.cartService.clearCart(customerId);
          return { message: 'Clear cart successfully' };
        } catch (error) {
          throw new HttpException('An error occurred while clearing the cart', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      @Get(':customerId')
      async getCart(
        @Param('customerId') customerId: number,
      ) {
        try {
          const cartItems = await this.cartService.getCart(customerId);
          return cartItems;
        } catch (error) {
          throw new HttpException('An error occurred while get cart', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      @Delete(':customerId/:productId')
      async removeCartItem(
        @Param('customerId') customerId: number,
        @Param('productId') productId: number,
      ) {
        try {
          await this.cartService.removeCartItemByProductId(customerId, productId);
          return { message: `Remove product ${productId} successfully`};
        } catch (error) {
          throw new HttpException(`An error occurred while remove product ${productId}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

      @Put(':id/:quantity')
      async updateCartProductQuantity(
        @Param('id') id: number,
        @Param('quantity') quantity: number,
      ) {
        try {
          const result = await this.cartService.updateCartProductQuantity(id, quantity);
          return { message: 'Update quantity successfully' };
        } catch (error) {
          throw new HttpException('An error occurred while update quantity', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  }
  