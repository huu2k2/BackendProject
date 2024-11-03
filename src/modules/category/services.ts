import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import {prisma} from '../../prismaClient'

export class CategoryService {
  async createCategory(dto: CreateCategoryDto) {
    return await prisma.category.create({
      data: dto,
      include: {
        products: true
      }
    });
  }

  async getCategories() {
    return await prisma.category.findMany({
      include: {
        products: {
          where: { isActive: true }
        }
      }
    });
  }

  async getCategoryById(categoryId: string) {
    return await prisma.category.findUnique({
      where: { categoryId },
      include: {
        products: {
          where: { isActive: true }
        }
      }
    });
  }

  async updateCategory(categoryId: string, dto: UpdateCategoryDto) {
    return await prisma.category.update({
      where: { categoryId },
      data: dto,
      include: {
        products: true
      }
    });
  }

  async deleteCategory(categoryId: string) {
    return await prisma.category.delete({
      where: { categoryId }
    });
  }
}