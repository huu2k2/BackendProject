import { PrismaClient } from '@prisma/client'
import { CreateProductDto, UpdateProductDto, ProductQuery } from './dto'
import { createImage } from '../../config/cloudinaryConfig'

const prisma = new PrismaClient()

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
      ...(query.isActive !== undefined && { isActive: query.isActive === "true"  }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search } },
          { description: { contains: query.search } }
        ]
      })
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
    })

    if (products.length === 0) {
      throw new Error('No products found')
    }
    return products
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
