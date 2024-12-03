import { Request, Response, NextFunction } from 'express'
import { Service } from './services'

const service = new Service()

export class Controller {
  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.create(req.body)
      return res.status(201).json({
        message: 'Create success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.getAll(next)
      return res.status(200).json({
        message: 'Get all category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.getById(req.params.categoryId, next)
      return res.status(200).json({
        message: 'Get category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.update(req.params.categoryId, req.body, next)
      return res.status(200).json({
        message: 'Update category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.delete(req.params.categoryId, next)
      return res.status(200).json({
        message: 'delete category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }
}
