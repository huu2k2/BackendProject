import { Request, Response, NextFunction } from 'express'
import { areaService } from './services'

export class AreaController {
  async createArea(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const area = await areaService.createArea(req.body, next)
      return res.status(201).json({
        message: 'Area created successfully',
        data: area
      })
    } catch (error) {
      next(error)
    }
  }

  async getAreas(req: Request, res: Response, next: NextFunction): Promise<any> {
    const areas = await areaService.getAreas(next)
    return res.status(200).json(areas)
  }

  async getAreaById(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { areaId } = req.params
    const area = await areaService.getAreaById(areaId, next)
    return res.status(200).json({
      data: area
    })
  }

  async updateArea(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { areaId } = req.params
    const area = await areaService.updateArea(areaId, req.body, next)
    return res.status(200).json({
      message: 'Area updated successfully',
      data: area
    })
  }

  async deleteArea(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { areaId } = req.params
    await areaService.deleteArea(areaId, next)
    res.status(200).json({
      message: 'Area deleted successfully'
    })
  }
}

export const areaController = new AreaController()
