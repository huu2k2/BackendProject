import { PrismaClient } from '@prisma/client'
import { CreateProductDto, UpdateProductDto, ProductQuery } from './dto'
import { prisma } from '../.././prismaClient'
import { createImage } from '../../config/cloudinaryConfig'

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

  async getProductById(productId: string) {
    return await prisma.product.findUnique({
      where: { productId },
      include: {
        category: true
      }
    })
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
}
