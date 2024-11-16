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

export class TableDetail {
  tableDetailId!: string
  tableId!: string
  orderId!: string
  note?: string | null
  startTime!: Date
  endTime?: Date | null
  createdAt!: Date
  updatedAt?: Date | null
}
