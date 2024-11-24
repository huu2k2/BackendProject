import e, { Request, Response, NextFunction } from 'express'
import { TableService } from './services'
import jwt from 'jsonwebtoken'

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
      const authHeader = req!.headers!.authorization
      const token = authHeader!.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      req.user = decoded
      const result = await tableService.createTableDetail(req.params.tableId, req.user.customerId, next)
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

  async createMergeTable(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { tableId } = req.params
      const data: { a: string[]; o: string[] } = req.body
      const order = await tableService.createMergeTable(tableId, data, next)
      return res.status(200).json({
        message: 'merge successful tables',
        data: order
      })
    } catch (error) {
      next(error)
    }
  }

  async updateStatusTable(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { tableId } = req.params
      const result = await tableService.updateStatusTableById(tableId)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

}
