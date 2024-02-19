import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    id: number,
    name: string,
    description: string,
  ): Promise<Category> {
    const newCategory = new Category();
    newCategory.id = id;
    newCategory.name = name;
    newCategory.description = description;

    return await this.categoryRepository.save(newCategory);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findCategoryById(id: number): Promise<Category | undefined> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async findCategoriesByIds(ids: number[]): Promise<Category[]> {
    const promises = ids.map((id) => {
      return this.categoryRepository.findOne({ where: { id } });
    });
    const categoryList = await Promise.all(promises);
    return categoryList;
  }

  async updateCategory(
    id: number,
    name: string,
    description: string,
  ): Promise<Category | undefined> {
    const category = await this.findCategoryById(id);

    if (!category) {
      return undefined;
    }

    category.name = name;
    category.description = description;
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
