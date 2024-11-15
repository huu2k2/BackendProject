import { TableStatus } from '@prisma/client'
export interface ICreateTable {
  tableId: string
  status: TableStatus
  name: string
  areaId: string
}

export interface IUpdateTable {
  tableId?: string
  status?: TableStatus
  name?: string
  areaId?: string
}
