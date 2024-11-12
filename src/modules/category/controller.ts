import { Request, Response, NextFunction } from 'express'
import { Service } from './services'

const service = new Service()

export class Controller {
  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    const table = await service.create(req.body, next)
    return res.status(201).json(table)
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<any> {
    const tables = await service.getAll(next)
    return res.json(tables)
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<any> {
    console.log(req.params.categoryId)
    const table = await service.getById(req.params.categoryId, next)
    if (!table) {
      return res.status(404).json({ message: 'Table not found' })
    }
    return res.json(table)
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    const table = await service.update(req.params.categoryId, req.body, next)
    return res.json(table)
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
    const table = await service.delete(req.params.categoryId, next)
    return res.status(204).send()
  }
}
