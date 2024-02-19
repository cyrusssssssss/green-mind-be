import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  NotFoundException,
  Query
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    const categories = await this.categoryService.findAllCategories();
    return categories;
  }

  @Post()
  async createCategory(
    @Body() body: { id: number; name: string; description: string },
  ) {
    const newCategory = await this.categoryService.createCategory(
      body.id,
      body.name,
      body.description,
    );
    return newCategory;
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    const category = await this.categoryService.findCategoryById(id);

    if (!category) {
      throw new NotFoundException(`Category  with id ${id} does not exist.`);
    }

    await this.categoryService.deleteCategory(id);
    return { message: `Category with id ${id} has been successfully deleted.` };
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() body: { name: string; description: string },
  ) {
    const existingCategory = await this.categoryService.findCategoryById(id);

    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} does not exist.`);
    }
    const updatedCategory = await this.categoryService.updateCategory(
      id,
      body.name,
      body.description,
    );
    return updatedCategory;
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
      const category = await this.categoryService.findCategoryById(id);
      if (!category) {
          throw new NotFoundException(`Category with id ${id} does not exist.`);
      }
      return category;
  }

 @Get('/getby/ids')
  async findCategoriesByIds(@Query('ids') ids: string){
    const categoryIds = ids.split(',').map(Number);
    return this.categoryService.findCategoriesByIds(categoryIds);
  }
}
