import { Order, PrismaClient, Table, TableStatus } from '@prisma/client'
import { ICreateTable, TableDetail, IUpdateTable } from './interface'
import { NextFunction } from 'express'
import { ApiError } from '../../middleware/error.middleware'
import { OrderService } from '../order/services'
import { IOrder } from '../order/interface'
import { table } from 'console'
import { HttpStatus } from '../../utils/HttpStatus'

const prisma = new PrismaClient()
const orderService = new OrderService()

export class TableService {
  async createTable(dto: ICreateTable): Promise<ICreateTable | undefined> {
    const existingTable = await prisma.table.findFirst({
      where: { name: dto.name }
    })

    if (existingTable) {
      throw new ApiError(HttpStatus.CONFLICT.code, 'Table already exist')
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

    if (!result) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to create table')
    }

    return result[0]
  }

  async getTables(): Promise<Partial<Table>[] | undefined> {
    try {
      const tables = await prisma.table.findMany({
        include: {
          area: true,
          tableDetails: true
        },

        orderBy: { name: 'desc' }
      })
      if (!tables) {
        throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get tables')
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
        throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to get table')
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
        throw new ApiError(HttpStatus.CONFLICT.code, 'Table name already exists')
      }

      const table = await prisma.table.update({
        where: { tableId },
        data: dto
      })
      if (!table) {
        throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to update table')
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
        throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to delete table')
      }
      return true
    } catch (error) {
      throw error
    }
  }

  async createTableDetail(
    tableId: string,
    customerId: string,
    next: NextFunction
  ): Promise<{ order: IOrder; tableDetail: TableDetail } | undefined> {
    // check order
    const isExistOrder = await prisma.order.findMany({
      where: {
        customerId: customerId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    })

    // lấy order đã có
    if (isExistOrder.length > 0 && isExistOrder[0].status == 'FAILED') {
      console.log(1)
      const isExistTableDetail = await prisma.tableDetail.findUnique({
        where: {
          tableId: tableId,
          orderId: isExistOrder[0].orderId
        }
      })
      if (isExistTableDetail) {
        return { order: isExistOrder[0], tableDetail: isExistTableDetail }
      }
    }

    // tạo mới
    const isAvailabelTable = await prisma.table.findUnique({
      where: {
        tableId: tableId
      }
    })

    if (isAvailabelTable?.status === TableStatus.OCCUPIED) {
      return undefined
    }

    const order = await orderService.createOrder(customerId)
    if (!order) {
      throw new ApiError(HttpStatus.BAD_REQUEST.code, 'Failed to create order for table')
    }

    const tableDetail = await prisma.tableDetail.create({
      data: {
        tableId: tableId,
        orderId: order!.orderId,
        startTime: new Date()
      }
    })

    await prisma.table.update({
      where: { tableId: tableId },
      data: {
        status: TableStatus.OCCUPIED
      }
    })

    return { order, tableDetail }
  }

  async getTableDetailToMergeByTableId(tableId: string, next: NextFunction): Promise<TableDetail | undefined> {
    try {
      const tableDetail = await prisma.tableDetail.findMany({
        where: {
          tableId: tableId,
          endTime: null
        },
        include: {
          order: true
        }
      })
      return tableDetail[0]
    } catch (error) {
      throw error
    }
  }

  async getTablesByAreaId(id: string, next: NextFunction): Promise<Table[] | undefined> {
    try {
      let ressult = []
      if (id == 'all') {
        ressult = await prisma.table.findMany({
          include: {
            tableDetails: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        })
      } else {
        ressult = await prisma.table.findMany({
          where: { areaId: id },
          include: {
            tableDetails: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        })
      }

      return ressult
    } catch (error) {
      throw error
    }
  }

  async getOrderByTableDetailId(id: string, next: NextFunction): Promise<Order | undefined> {
    try {
      let ressult = await prisma.tableDetail.findFirst({
        where: { tableDetailId: id },
        include: {
          order: {
            include: {
              orderDetails: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      })
      return ressult?.order
    } catch (error) {
      throw error
    }
  }

  // o[]: list contain tableDetailId
  // a[]: list contain tableId
  async createMergeTable(tableId: string, data: { a: string[]; o: string[] }, next: NextFunction): Promise<any> {
    try {
      return await prisma.$transaction(async (tx) => {
        const table = await prisma.table.findFirst({
          where: {
            tableId: tableId
          },
          include: {
            tableDetails: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1,
              include: {
                order: true
              }
            }
          }
        })

        const orderMerge = await tx.orderMerge.create({
          data: {
            createdAt: new Date()
          }
        })

        const tableDetails = await tx.tableDetail.findMany({
          where: {
            tableDetailId: {
              in: data.o
            }
          }
        })

        const orderIds = tableDetails.map((detail) => detail.orderId)

        const orders = await tx.order.updateMany({
          where: {
            orderId: {
              in: orderIds
            }
          },
          data: {
            orderMergeId: orderMerge.orderMergeId
          }
        })

        await tx.order.update({
          where: {
            orderId: table!.tableDetails[0].order.orderId
          },
          data: {
            orderMergeId: orderMerge.orderMergeId
          }
        })

        await tx.table.updateMany({
          where: {
            tableId: {
              in: data.a
            }
          },
          data: {
            status: 'OCCUPIED'
          }
        })

        return orders
      })
    } catch (error) {
      throw error
    }
  }
}
