import { PrismaClient, Table, TableStatus } from '@prisma/client'
import { ICreateTable, TableDetail, IUpdateTable } from './interface'
import { NextFunction } from 'express'
import { ApiError } from '../../middleware/error.middleware'
import { OrderService } from '../order/services'

const prisma = new PrismaClient()
const orderService = new OrderService()

export class TableService {
  async createTable(dto: ICreateTable, next: NextFunction): Promise<ICreateTable | undefined> {
    try {
      const existingTable = await prisma.table.findFirst({
        where: { name: dto.name }
      })

      if (existingTable) {
        throw new ApiError(400, 'Table name already exists')
      }

      const result = await prisma.$transaction([
        prisma.table.create({
          data: {
            status: 'AVAILABLE',
            name: dto.name,
            area: {
              connect: { areaId: dto.areaId }
            }
          }
        }),
        prisma.area.update({
          where: { areaId: dto.areaId },
          data: {
            total: { increment: 1 }
          }
        })
      ])

      return result[0]
    } catch (error) {
      next(error)
    }
  }

  async getTables(next: NextFunction): Promise<Partial<Table>[] | undefined> {
    try {
      const tables = await prisma.table.findMany({
        include: {
          area: true,
          tableDetails: true
        }
      })
      if (!tables) {
        throw new ApiError(400, 'Failed to get tables')
      }
      return tables
    } catch (error) {
      throw error
    }
  }

  async getTableById(tableId: string, next: NextFunction): Promise<Table | undefined> {
    try {
      const table = await prisma.table.findUnique({
        where: { tableId },
        include: {
          area: true,
          tableDetails: true
        }
      })
      if (!table) {
        throw new ApiError(400, 'Failed to get table')
      }
      return table
    } catch (error) {
      throw error
    }
  }

  async updateTable(tableId: string, dto: IUpdateTable, next: NextFunction): Promise<Boolean | undefined> {
    try {
      // Kiểm tra xem tên bảng đã tồn tại trong cơ sở dữ liệu chưa
      const existingTable = await prisma.table.findFirst({
        where: {
          name: dto.name,
          NOT: { tableId }
        }
      })

      // Nếu đã tồn tại bảng với tên này, ném lỗi
      if (existingTable) {
        throw new ApiError(400, 'Table name already exists')
      }

      const table = await prisma.table.update({
        where: { tableId },
        data: dto
      })
      if (!table) {
        throw new ApiError(400, 'Failed to update table')
      }
      return true
    } catch (error) {
      throw error
    }
  }

  async deleteTable(tableId: string, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const table = await prisma.table.delete({
        where: { tableId }
      })
      if (!table) {
        throw new ApiError(400, 'Failed to delete table')
      }
      return true
    } catch (error) {
      throw error
    }
  }

  async createTableDetail(id: string, next: NextFunction): Promise<TableDetail | undefined> {
    try {
      let order = await orderService.createOrder('17ae36f6-a3ce-11ef-a569-0242ac120002', next)

      const tableDetail = await prisma.tableDetail.create({
        data: {
          tableId: id,
          orderId: order!.orderId,
          startTime: new Date()
        }
      })

      await prisma.table.update({
        where: { tableId: id },
        data: {
          status: 'OCCUPIED'
        }
      })
      return tableDetail
    } catch (error) {
      next(error)
    }
  }
}
