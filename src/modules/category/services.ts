import { PrismaClient } from '@prisma/client'

import { ICategory, ICategoryDto } from './interface'
import { ApiError } from '../../middleware/error.middleware'
import { HttpStatus } from '../../utils/HttpStatus'

const prisma = new PrismaClient()

export class Service {
  async create(dto: ICategoryDto): Promise<ICategory | undefined> {
    const check = await prisma.category.findFirst({
      where: {
        name: dto.name
      }
    })

    if (check) {
      throw new ApiError(HttpStatus.CONFLICT.code, 'Tên danh mục đã tồn tại!')
    }

    const category = await prisma.category.create({
      data: {
        name: dto.name
      }
    })

    if (!category) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to create category')
    }

    return category
  }

  async getAll(): Promise<any> {
    const category = await prisma.category.findMany()
    if (!category) return []
    return category
  }

  async getById(id: string): Promise<any> {
    const category = await prisma.category.findUnique({
      where: { categoryId: id }
    })
    if (!category) {
      throw new ApiError(HttpStatus.NOT_FOUND.code, 'Not found category')
    }
    return category
  }

  async update(id: string, dto: ICategoryDto): Promise<ICategory | undefined> {
    const check = await prisma.category.findFirst({
      where: { categoryId: id }
    })

    if (!check) {
      throw new ApiError(HttpStatus.NOT_FOUND.code, 'Not found category')
    }

    const category = await prisma.category.update({
      where: { categoryId: id },
      data: dto
    })

    if (!category) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to update category')
    }

    return category
  }

  async delete(categoryId: string): Promise<Boolean | undefined> {
    const check = await prisma.category.findFirst({
      where: { categoryId }
    })

    if (!check) {
      throw new ApiError(HttpStatus.NOT_FOUND.code, 'Not found category')
    }

    const category = await prisma.category.delete({
      where: { categoryId }
    })

    if (!category) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to delete category')
    }

    return true
  }

  async getAllSocket(): Promise<any> {
    return new Promise(async (resovle, reject) => {
      try {
        const category = await prisma.category.findMany()
        resovle(category)
      } catch (error) {
        reject(error)
      }
    })
  }
}
