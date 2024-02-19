import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Category } from '../category/entity/category.entity';
import { SearchProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts() {
    const products = await this.productService.findAllProducts();
    return products;
  }

  @Post()
  async createProduct(
    @Body()
    body: {
      id: number;
      name: string;
      description: string;
      price: number;
      quantity: number;
      image: string;
      categories: Category[];
    },
  ) {
    const newProduct = await this.productService.createProduct(
      body.id,
      body.name,
      body.description,
      body.price,
      body.quantity,
      body.image,
      body.categories,
    );
    return newProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    const product = await this.productService.findProductById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} does not exist.`);
    }

    await this.productService.deleteProduct(id);
    return { message: `Product with id ${id} has been successfully deleted.` };
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      quantity: number;
      image: string;
      categories: Category[];
    },
  ) {
    const existingProduct = await this.productService.findProductById(id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} does not exist.`);
    }
    const updatedProduct = await this.productService.updateProduct(
      id,
      body.name,
      body.description,
      body.price,
      body.quantity,
      body.image,
      body.categories,
    );
    return updatedProduct;
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productService.findProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} does not exist.`);
    }
    return product;
  }

  @Post('search')
  async searchProduct(@Body() searchProduct: SearchProductDto,
  ) {
    try {
      const products = await this.productService.searchProduct(
        searchProduct.key,
      );
      return { products };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get("get/categories")
  async getAllProductsWithCategories() {
    const products = await this.productService.getAllProductsWithCategories();
    return products;
  }

  @Get('image/:id')
  async getProductImageUrl(@Param('id') id: number) {
    const url = await this.productService.getProductImageUrl(id);
    return url;
  }
}
