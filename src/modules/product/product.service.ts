import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { Category } from '../category/entity/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    image: string,
    categories: Category[],
  ): Promise<Product> {
    const newProduct = new Product();
    newProduct.id = id;
    newProduct.name = name;
    newProduct.description = description;
    newProduct.price = price;
    newProduct.quantity = quantity;
    newProduct.image = image;
    newProduct.categories = categories;

    return await this.productRepository.save(newProduct);
  }

  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findProductById(id: number): Promise<Product | undefined> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async updateProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    image: string,
    categories: Category[],
  ): Promise<Product | undefined> {
    const product = await this.findProductById(id);

    if (!product) {
      return undefined;
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.image = image;
    product.categories = categories;

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async searchProduct(key: string): Promise<Product[]> {
    const allProducts = await this.productRepository.find({ relations: ['categories'] });
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(key.toLowerCase())
    );
  }

  async getAllProductsWithCategories() {
    return await this.productRepository.find({ relations: ['categories'] });
  };

  async getProductImageUrl(id: number): Promise<string> {
    const product = await this.productRepository.findOne({ where: { id } });
    return product.image;
  };
}