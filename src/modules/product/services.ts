import { PrismaClient } from '@prisma/client'
import { CreateProductDto, UpdateProductDto, ProductQuery } from './dto'
import { createImage } from '../../config/cloudinaryConfig'

const prisma = new PrismaClient()

export class ProductService {
  async createProduct(dto: CreateProductDto) {
    const { image, ...rest } = dto
    console.log(dto)
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
      }
    })

    if (products.length === 0) {
      return []
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
