import { PrismaClient, Product } from '@prisma/client'
import { CreateProductDto, UpdateProductDto, ProductQuery } from './dto'
import { createImage } from '../../config/cloudinaryConfig'
import { NextFunction } from 'express'

const prisma = new PrismaClient()

export class ProductService {
  async createProduct(dto: CreateProductDto) {
    const { image, ...rest } = dto
    const { url, publicId } = await createImage(image)
    const rs = await prisma.product.create({
      data: { ...rest, image: url, imagePublicId: publicId }
    })
    if (!rs) throw new Error('Can not create product')
    return rs
  }

  async getProducts(query: ProductQuery) {
    const where = {
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.isActive !== undefined && { isActive: query.isActive === 'true' }),
      ...(query.search && {
        name: { contains: query.search }
      })
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    })

    if (products.length === 0 || !products) {
      return []
    }
    return products
  }

  async getProductById(productId: string, next: NextFunction): Promise<any> {
    try {
      const product = await prisma.product.findUnique({
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
    } catch (error) {
      next(error)
    }
  }

  async updateProduct(productId: string, dto: UpdateProductDto) {
    try {
      const updateProduct = await prisma.product.update({
        where: { productId },
        data: dto,
        include: {
          category: true
        }
      })
      if (!updateProduct) {
        throw new Error('Update is not success!')
      }
      return updateProduct
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async deleteProduct(productId: string) {
    return await prisma.product.update({
      where: { productId },
      data: { isActive: false }
    })
  }

  async getProductByCategoryById(categoryId: string, next: NextFunction): Promise<Product[] | undefined> {
    try {
      let products: Product[]
      if (categoryId == 'all') {
        products = await prisma.product.findMany({
          orderBy: { name: 'asc' }
        })
      } else {
        products = await prisma.product.findMany({
          where: { categoryId: categoryId },
          orderBy: { name: 'asc' }
        })
      }
      return products
    } catch (error) {
      next(error)
    }
  }
}
