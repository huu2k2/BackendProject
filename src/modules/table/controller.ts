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
      return res.json({
        message: 'get all tables',
        data: tables
      })
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
      return res.json({
        message: 'get all table',
        data: table
      })
    } catch (error) {
      next(error)
    }
  }

  async getTableDetailToMergeByTableId(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await tableService.getTableDetailToMergeByTableId(req.params.tableId, next)
      if (!table) {
        return res.status(404).json({ message: 'Table not found' })
      }
      return res.json({
        message: 'get table detail to merge',
        data: table
      })
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
      return res.status(200).send()
    } catch (error) {
      next(error)
    }
  }

  async createDetail(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const result = await tableService.createTableDetail(req.params.tableId, next)
      return res.status(200).json({
        message: 'create detail success',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  async getTablesByAreaId(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { areaId } = req.params
      const tables = await tableService.getTablesByAreaId(areaId, next)
      return res.status(200).json({
        message: 'get successful tables',
        data: tables
      })
    } catch (error) {
      next(error)
    }
  }

  async getOrderByTableDetailId(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params
      const order = await tableService.getOrderByTableDetailId(id, next)
      return res.status(200).json({
        message: 'get successful tables',
        data: order
      })
    } catch (error) {
      next(error)
    }
  }
}
