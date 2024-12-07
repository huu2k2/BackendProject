import e, { Request, Response, NextFunction } from 'express'
import { TableService } from './services'
import jwt from 'jsonwebtoken'
import { HttpStatus } from '../../utils/HttpStatus'

const tableService = new TableService()

export class TableController {
  async createTable(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await tableService.createTable(req.body)
      return res.status(HttpStatus.CREATED.code).json({
        message: 'new table created',
        data: table
      })
    } catch (error) {
      next(error)
    }
  }

  async getTables(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tables = await tableService.getTables()
      return res.status(HttpStatus.OK.code).json({
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
        return res.status(HttpStatus.NOT_FOUND.code).json({ message: 'Table not found' })
      }
      return res.status(HttpStatus.OK.code).json({
        message: 'get table success',
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
        return res.status(HttpStatus.NOT_FOUND.code).json({ message: 'Table not found' })
      }
      return res.status(HttpStatus.OK.code).json({
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
      return res.status(HttpStatus.OK.code).json({
        message: 'table updated',
        data: table
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteTable(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const table = await tableService.deleteTable(req.params.tableId, next)
      return res.status(HttpStatus.OK.code).send({
        message: 'table deleted',
        data: table
      })
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
      return res.status(HttpStatus.OK.code).json({
        message: !result ? "Bàn đã được đặt sẵn!":'create detail success',
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
      return res.status(HttpStatus.OK.code).json({
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
      return res.status(HttpStatus.OK.code).json({
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
      return res.status(HttpStatus.OK.code).json({
        message: 'merge successful tables',
        data: order
      })
    } catch (error) {
      next(error)
    }
  }
}
