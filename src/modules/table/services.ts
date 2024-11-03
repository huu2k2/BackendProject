import { PrismaClient, Table, TableStatus } from '@prisma/client'
import { ICreateTable, IUpdateTable } from './interface'
import { NextFunction } from 'express'

const prisma = new PrismaClient()

export class TableService {
  async createTable(dto: ICreateTable, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const table = await prisma.table.create({
        data: dto
      })
      if (!table) {
        throw new Error('Failed to create table')
      }
      return true
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
        throw new Error('Failed to get tables')
      }
      return tables
    } catch (error) {
      next(error)
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
        throw new Error('Failed to get table')
      }
      return table
    } catch (error) {
      next(error)
    }
  }

  async updateTable(tableId: string, dto: IUpdateTable, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const table = await prisma.table.update({
        where: { tableId },
      data: dto
      })
      if (!table) {
        throw new Error('Failed to update table')
      }
      return true
    } catch (error) {
      next(error)
    }
  }

  async deleteTable(tableId: string, next: NextFunction): Promise<Boolean | undefined> {
    try {
      const table = await prisma.table.delete({
        where: { tableId }
      })
      if (!table) {
        throw new Error('Failed to delete table')
      }
      return true
    } catch (error) {
      next(error)
    }
  }
}
