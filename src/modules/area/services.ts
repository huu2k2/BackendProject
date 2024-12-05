import { Area } from '@prisma/client'
import { prisma } from '../../prismaClient'
import { ICreateArea, IUpdateArea } from './interface'
import { ApiError } from '../../middleware/error.middleware'
import { HttpStatus } from '../../utils/HttpStatus'

export class AreaService {
  async createArea(data: ICreateArea): Promise<Partial<Area> | undefined> {
    const existingArea = await prisma.area.findFirst({
      where: { name: data.name }
    })

    if (existingArea) {
      throw new ApiError(HttpStatus.CONFLICT.code, 'name exist!')
    }
    const area = await prisma.area.create({
      data: {
        name: data.name,
        total: 0
      }
    })
    if (!area) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to create category')
    }
    return area
  }

  async getAreas(): Promise<Partial<Area>[] | undefined> {
    try {
      const area = await prisma.area.findMany({
        orderBy: { name: 'asc' }
      })
      if (!area) return []
      return area
    } catch (error) {
      throw error
    }
  }

  async getAreaById(areaId: string): Promise<Partial<Area> | undefined> {
    try {
      const area = await prisma.area.findUnique({
        where: { areaId },
        include: {
          tables: true
        }
      })

      if (!area) {
        throw new ApiError(HttpStatus.NOT_FOUND.code, 'Area not found')
      }
      return area
    } catch (error) {
      throw error
    }
  }

  async updateArea(areaId: string, data: IUpdateArea): Promise<Partial<Area> | undefined> {
    return await prisma.$transaction(async (tx) => {
      if (data.name) {
        const existingArea = await tx.area.findFirst({
          where: {
            name: data.name,
            NOT: { areaId }
          }
        })

        if (existingArea) {
          throw new ApiError(HttpStatus.CONFLICT.code, 'Area name already exists')
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
  }

  async deleteArea(areaId: string): Promise<Boolean | undefined> {
    return await prisma.$transaction(async (tx) => {
      const areaWithTables = await tx.area.findUnique({
        where: { areaId },
        include: {
          tables: true
        }
      })

      if (!areaWithTables) {
        throw new ApiError(HttpStatus.NOT_FOUND.code, 'Not found area!')
      }

      if (areaWithTables?.tables.length) {
        throw new ApiError(HttpStatus.CONFLICT.code, 'Cannot delete area with existing tables')
      }

      const deletedArea = await tx.area.delete({
        where: { areaId }
      })

      if (!deletedArea) {
        throw new ApiError(HttpStatus.BAD_REQUEST.code, " You don't remove area!")
      }

      return true
    })
  }
}

export const areaService = new AreaService()
