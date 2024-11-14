import { PrismaClient, Table, TableStatus } from '@prisma/client'

import { NextFunction } from 'express'
import { ICategory, ICategoryDto } from './interface'

const prisma = new PrismaClient()

export class Service {
  async create(dto: ICategoryDto, next: NextFunction): Promise<ICategory | undefined> {
    try {
      const category = await prisma.category.create({
        data: {
          name: dto.name
        }
      })
      if (!category) {
        throw new Error('Failed to create category')
      }
      return category
    } catch (error) {
      next(error)
    }
  }

  async getAll(next: NextFunction): Promise<ICategory[] | undefined> {
    try {
      const categories = await prisma.category.findMany()
      if (!categories) {
        throw new Error('Failed to get category')
      }
      return categories
    } catch (error) {
      next(error)
    }
  }

  async getById(id: string, next: NextFunction): Promise<any> {
    try {
      console.log(id)
      const category = await prisma.category.findUnique({
        where: { categoryId: id }
      })
      if (!category) {
        throw new Error('Failed to get category')
      }
      return category
    } catch (error) {
      next(error)
    }
  }

  async update(id: string, dto: ICategoryDto, next: NextFunction): Promise<ICategory | undefined> {
    try {
      const category = await prisma.category.update({
        where: { categoryId: id },
        data: dto
      })
      if (!category) {
        throw new Error('Failed to update category')
      }
      return category
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
        throw new Error('Failed to delete table')
      }
      return true
    } catch (error) {
      next(error)
    }
  }
}
