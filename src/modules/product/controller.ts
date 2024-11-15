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
      const product = await this.productService.getProductById(req.params.productId, next)
      res.status(200).json({
        message: 'Get products success',
        data: product
      })
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

  async getProductByCategoryById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { categoryId } = req.params
      const products = await this.productService.getProductByCategoryById(categoryId, next)
      res.status(200).json({
        message: 'Get products success',
        data: products
      })
    } catch (error) {
      next(error)
    }
  }

  async getRandProducts(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const products = await this.productService.getRandProducts(next);
      res.status(200).json({
        message: 'Get products success',
        data: products
      })
    } catch (error) {
      next(error)
    }
  }
}
