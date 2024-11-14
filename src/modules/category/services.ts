import { PrismaClient, Table, TableStatus } from '@prisma/client'

import { NextFunction } from 'express'
import { ICreateCategory } from './interface'
import { ApiError } from '../../middleware/error.middleware'

const prisma = new PrismaClient()

export class Service {
  async create(dto: ICreateCategory, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const category = await prisma.category.create({
        data: {
          name: dto.name
        }
      })
      if (!category) {
        throw new ApiError(400, 'Failed to create category')
      }
      return true
    } catch (error) {
      next(error)
    }
  }

  async getAll(next: NextFunction): Promise<any> {
    try {
      const category = await prisma.category.findMany()
      return category
    } catch (error) {
      next(error)
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
      next(error)
    }
  }

  async update(id: string, dto: any, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const category = await prisma.category.update({
        where: { categoryId: id },
        data: dto
      })
      if (!category) {
        throw new ApiError(400, 'Failed to update category')
      }
      return true
    } catch (error) {
      next(error)
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
      next(error)
    }
  }
}
