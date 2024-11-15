import e, { Request, Response, NextFunction } from 'express'
import { TableService } from './services'

const tableService = new TableService()

export class TableController {
  async createTable(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await tableService.createTable(req.body, next)
      return res.status(201).json(table)
    } catch (error) {
      next(error)
    }
  }

  async getTables(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tables = await tableService.getTables(next)
      return res.json(tables)
    } catch (error) {
      next(error)
    }
  }

  async getTableById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await tableService.getTableById(req.params.tableId, next)
      if (!table) {
        return res.status(404).json({ message: 'Table not found' })
      }
      return res.json(table)
    } catch (error) {
      next(error)
    }
  }

  async updateTable(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await tableService.updateTable(req.params.tableId, req.body, next)
      return res.json(table)
    } catch (error) {
      next(error)
    }
  }

  async deleteTable(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await tableService.deleteTable(req.params.tableId, next)
      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}