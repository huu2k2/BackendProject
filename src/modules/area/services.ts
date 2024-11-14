import { Area } from '@prisma/client'
import { prisma } from '../../prismaClient'
import { ICreateArea, IUpdateArea } from './interface'
import { NextFunction } from 'express'
import { ApiError } from '../../middleware/error.middleware'

export class AreaService {
  async createArea(data: ICreateArea, next: NextFunction): Promise<Partial<Area> | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        const existingArea = await tx.area.findFirst({
          where: { name: data.name }
        })

        if (existingArea) {
          throw new ApiError(400, 'name exist!')
        }
        return tx.area.create({
          data: {
            name: data.name,
            total: 0
          }
        })
      })
    } catch (error) {
      throw error
    }
  }

  async getAreas(next: NextFunction): Promise<Partial<Area>[] | undefined> {
    try {
      return await prisma.area.findMany({
        include: {
          tables: true
        }
      })
    } catch (error) {
      next(error)
      return undefined
    }
  }

  async getAreaById(areaId: string, next: NextFunction): Promise<Partial<Area> | undefined> {
    try {
      const area = await prisma.area.findUnique({
        where: { areaId },
        include: {
          tables: true
        }
      })
      if (!area) {
        throw new Error('Area not found')
      }
      return area
    } catch (error) {
      next(error)
      return undefined
    }
  }

  async updateArea(areaId: string, data: IUpdateArea, next: NextFunction): Promise<Partial<Area> | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        if (data.name) {
          const existingArea = await tx.area.findFirst({
            where: {
              name: data.name,
              NOT: { areaId }
            }
          })

          if (existingArea) {
            throw new Error('Area name already exists')
          }
        }

        return tx.area.update({
          where: { areaId },
          data,
          include: {
            tables: true
          }
        })
      })
    } catch (error) {
      next(error)
      return undefined
    }
  }

  async deleteArea(areaId: string, next: NextFunction): Promise<Boolean | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        // Check if area has tables
        const areaWithTables = await tx.area.findUnique({
          where: { areaId },
          include: {
            tables: true
          }
        })

        if (areaWithTables?.tables.length) {
          throw new Error('Cannot delete area with existing tables')
        }

        const deletedArea = await tx.area.delete({
          where: { areaId }
        })

        return deletedArea ? true : false
      })
    } catch (error) {
      next(error)
      return undefined
    }
  }
}

export const areaService = new AreaService()
