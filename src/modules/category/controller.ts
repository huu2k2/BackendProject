import { Request, Response, NextFunction } from 'express'
import { Service } from './services'
import { HttpStatus } from '../../utils/HttpStatus'

const service = new Service()

export class Controller {
  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.create(req.body)
      return res.status(HttpStatus.CREATED.code).json({
        message: 'Create success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.getAll()
      console.log("==========", category)
      return res.status(HttpStatus.OK.code).json({
        message: 'Get all category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.getById(req.params.categoryId)
      return res.status(HttpStatus.OK.code).json({
        message: 'Get category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.update(req.params.categoryId, req.body)
      return res.status(HttpStatus.OK.code).json({
        message: 'Update category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await service.delete(req.params.categoryId)
      return res.status(HttpStatus.OK.code).json({
        message: 'delete category success',
        data: category
      })
    } catch (error) {
      next(error)
    }
  }
}
