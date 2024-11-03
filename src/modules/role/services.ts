import { Role } from '@prisma/client'
import { prisma } from '../../prismaClient'
import { ICreateRole, IUpdateRole } from './interface'
import { NextFunction } from 'express'

export class RoleService {
  async createRole(data: ICreateRole, next: NextFunction): Promise<Boolean | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        const role = await tx.role.create({
          data: {
            name: data.name
          }
        })
        if (!role) {
          throw new Error('Role not created')
        }
        return true
      })
    } catch (error) {
      next(error)
    }
  }

  async getRoles(next: NextFunction): Promise<Role[] | undefined> {
    try {
      const roles = await prisma.role.findMany({
        include: {
          accounts: true
        }
      })
      if (!roles) {
        throw new Error('Roles not found')
      }
      return roles
    } catch (error) {
      next(error)
    }
  }

  async getRoleById(roleId: string, next: NextFunction): Promise<Partial<Role> | undefined> {
    try {
      const role = await prisma.role.findUnique({
        where: { roleId },
        include: {
          accounts: true
        }
      })
      if (!role) {
        throw new Error('Role not found')
      }
      return role
    } catch (error) {
      next(error)
    }
  }

  async updateRole(roleId: string, data: IUpdateRole, next: NextFunction): Promise<Partial<Role> | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        const role = await tx.role.update({
          where: { roleId },
          data
        })
        if (!role) {
          throw new Error('Role not updated')
        }
        return role
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteRole(roleId: string, next: NextFunction): Promise<Partial<Role> | undefined> {
    try {
      return await prisma.$transaction(async (tx) => {
        const role = await tx.role.delete({
          where: { roleId }
        })
        if (!role) {
          throw new Error('Role not deleted')
        }
        return role
      })
    } catch (error) {
      next(error)
    }
  }
}

export const roleService = new RoleService()
