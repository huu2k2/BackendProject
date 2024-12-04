import { Area } from '@prisma/client'
import { prisma } from '../../prismaClient'
import { ICreateArea, IUpdateArea } from './interface'
import { ApiError } from '../../middleware/error.middleware'

export class AreaService {
  async createArea(data: ICreateArea): Promise<Partial<Area> | undefined> {
    const existingArea = await prisma.area.findFirst({
      where: { name: data.name }
    })

    if (existingArea) {
      throw new ApiError(400, 'name exist!')
    }
    const area = await prisma.area.create({
      data: {
        name: data.name,
        total: 0
      }
    })
    if (!area) {
      throw new ApiError(400, 'Failed to create category')
    }
    return area
  }

  async getAreas(): Promise<Partial<Area>[] | undefined> {
    try {
      const area = await prisma.area.findMany()
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
        throw new ApiError(400, 'Area not found')
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
          throw new ApiError(400, 'Area name already exists')
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

      if(!areaWithTables){
        throw new ApiError(400, 'Not found area!')
      } 

      if (areaWithTables?.tables.length) {
        throw new ApiError(400, 'Cannot delete area with existing tables')
      }

      const deletedArea = await tx.area.delete({
        where: { areaId }
      })
      
      if(!deletedArea) {
        throw new ApiError(400, " You don't remove area!")
      }

      return true
    })
  }
}

export const areaService = new AreaService()
