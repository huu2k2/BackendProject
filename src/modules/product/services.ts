import { PrismaClient, Product } from '@prisma/client'
import { CreateProductDto, UpdateProductDto, ProductQuery } from './dto'
import { prisma } from '../.././prismaClient'
import { createImage } from '../../config/cloudinaryConfig'
import { NextFunction } from 'express'

export class ProductService {
  async createProduct(dto: CreateProductDto) {
    const { image, ...rest } = dto
    const { url, publicId } = await createImage(image)
    return await prisma.product.create({
      data: { ...rest, image: url, imagePublicId: publicId },
      include: {
        category: true
      }
    })
  }

  async getProducts(query: ProductQuery) {
    const where = {
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.isActive !== undefined && { isActive: query.isActive }),
      ...(query.search && {
        OR: [{ name: { contains: query.search } }, { description: { contains: query.search } }]
      })
    }

    return await prisma.product.findMany({
      where,
      include: {
        category: true
      }
    })
  }

  async getProductById(productId: string, next: NextFunction): Promise<Product | undefined> {
    try {
      let product = await prisma.product.findUnique({
        where: { productId }
      })
      return product
    } catch (error) {
      next(error)
    }
  }

  async getRandProducts(next: NextFunction): Promise<Product[] | undefined> {
    try {
      const products = await prisma.product.findMany({
        take: 10,
        orderBy: {
          productId: 'asc'
        }
      })
      const shuffled = products.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 10)
      return products
    } catch (error) {
      next(error)
    }
  }

  async updateProduct(productId: string, dto: UpdateProductDto) {
    return await prisma.product.update({
      where: { productId },
      data: dto,
      include: {
        category: true
      }
    })
  }

  async deleteProduct(productId: string) {
    return await prisma.product.update({
      where: { productId },
      data: { isActive: false }
    })
  }

  async getProductByCategoryById(categoryId: string, next: NextFunction): Promise<Product[] | undefined> {
    try {
      let products = []
      if (categoryId == 'all') {
        products = await prisma.product.findMany()
      } else {
        products = await prisma.product.findMany({
          where: { categoryId: categoryId }
        })
      }
      return products
    } catch (error) {
      next(error)
    }
  }
}
