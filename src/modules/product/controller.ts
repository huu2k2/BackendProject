import { Request, Response, NextFunction } from 'express'
import { ProductService } from './services'
import { ProductQuery } from './dto'

const productService: ProductService = new ProductService()
export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const product = await productService.createProduct(req.body)
      return res.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const query: ProductQuery = req.query
      const products = await productService.getProducts(query)
      return res.json(products)
    } catch (error) {
      next(error)
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const product = await productService.getProductById(req.params.productId, next)
      return res.json({
        message: 'get data',
        data: product
      })
    } catch (error) {
      next(error)
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const product = await productService.updateProduct(req.params.productId, req.body)
      return res.json(product)
    } catch (error) {
      next(error)
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      await productService.deleteProduct(req.params.productId)
      return res.json(true)
    } catch (error) {
      next(error)
    }
  }

  async getProductByCategoryById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { categoryId } = req.params
      console.log(categoryId)
      const products = await productService.getProductByCategoryById(categoryId, next)
      return res.status(200).json({
        message: 'Get products success',
        data: products
      })
    } catch (error) {
      next(error)
    }
  }

  async getRandProducts(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const products = await productService.getRandProducts(next)
      return res.status(200).json({
        message: 'Get products success',
        data: products
      })
    } catch (error) {
      next(error)
    }
  }
}
