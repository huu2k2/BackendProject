import { PrismaClient, Table, TableStatus } from '@prisma/client'

import { NextFunction } from 'express'

import { ICategory, ICategoryDto } from './interface'
import { ApiError } from '../../middleware/error.middleware'

const prisma = new PrismaClient()

export class Service {
  async create(dto: ICategoryDto): Promise<ICategory | undefined> {
    try {
      const check = await prisma.category.findFirst({
        where: {
          name: dto.name
        }
      })
      if (check) {
        throw new ApiError(400, 'Tên danh mục đã tồn tại!')
      }
      const category = await prisma.category.create({
        data: {
          name: dto.name
        }
      })
      if (!category) {
        throw new ApiError(400, 'Failed to create category')
      }
      return category
    } catch (error) {
      throw error
    }
  }

  async getAll(next: NextFunction): Promise<any> {
    try {
      const category = await prisma.category.findMany()
      return category
    } catch (error) {
      throw error
    }
  }

  async getById(id: string, next: NextFunction): Promise<any> {
    try {
      const category = await prisma.category.findUnique({
        where: { categoryId: id }
      })
      if (!category) {
        throw new ApiError(404, 'Not found category')
      }
      return category
    } catch (error) {
      throw error
    }
  }

  async update(id: string, dto: ICategoryDto, next: NextFunction): Promise<ICategory | undefined> {
    try {
      const category = await prisma.category.update({
        where: { categoryId: id },
        data: dto
      })
      if (!category) {
        throw new ApiError(400, 'Failed to update category')
      }
      return category
    } catch (error) {
      throw error
    }
  }

  async delete(id: string, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const category = await prisma.category.delete({
        where: { categoryId: id }
      })
      if (!category) {
        throw new ApiError(400, 'Failed to delete category')
      }
      return true
    } catch (error) {
      throw error
    }
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
