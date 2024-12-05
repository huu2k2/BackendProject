import { Request, Response, NextFunction } from 'express'
import { areaService } from './services'
import { HttpStatus } from '../../utils/HttpStatus'

export class AreaController {
  async createArea(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const area = await areaService.createArea(req.body)
      return res.status(HttpStatus.CREATED.code).json({
        message: 'Area created successfully',
        data: area
      })
    } catch (error) {
      next(error)
    }
  }

  async getAreas(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const areas = await areaService.getAreas()
      return res.status(HttpStatus.OK.code).json({
        message: 'Get successful data',
        data: areas
      })
    } catch (error) {
      next(error)
    }
  }

  async getAreaById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { areaId } = req.params
      const area = await areaService.getAreaById(areaId)
      return res.status(HttpStatus.OK.code).json({
        data: area
      })
    } catch (error) {
      next(error)
    }
  }

  async updateArea(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { areaId } = req.params
      const area = await areaService.updateArea(areaId, req.body)
      return res.status(HttpStatus.OK.code).json({
        message: 'Area updated successfully',
        data: area
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteArea(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const result = await areaService.deleteArea(req.params.areaId)
      res.status(HttpStatus.OK.code).json({
        data: result,
        message: 'Area deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

export const areaController = new AreaController()
