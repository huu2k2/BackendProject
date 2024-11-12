import { Request, Response, NextFunction } from 'express'
import { ProductService } from './services'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const product = await this.productService.createProduct(req.body)
      return res.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const products = await this.productService.getProducts(req.query)
      console.log(products)
      return res.json(products)
    } catch (error) {
      next(error)
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const product = await this.productService.getProductById(req.params.productId)
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }
      res.json(product)
    } catch (error) {
      next(error)
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const product = await this.productService.updateProduct(req.params.productId, req.body)
      res.json(product)
    } catch (error) {
      next(error)
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      await this.productService.deleteProduct(req.params.productId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
