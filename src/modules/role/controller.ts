import { Request, Response, NextFunction } from 'express'
import { roleService } from './services'
import { HttpStatus } from '../../utils/HttpStatus'

export class RoleController {
  async createRole(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const role = await roleService.createRole(req.body, next)
      return res.status(HttpStatus.CREATED.code).json({
        message: 'Role created successfully',
        data: role
      })
    } catch (error) {
      next(error)
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const roles = await roleService.getRoles(next)
      return res.status(HttpStatus.OK.code).json(roles)
    } catch (error) {
      next(error)
    }
  }

  async getRoleById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { roleId } = req.params
      const role = await roleService.getRoleById(roleId, next)
      return res.status(HttpStatus.OK.code).json({
        data: role
      })
    } catch (error) {
      next(error)
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { roleId } = req.params
      const role = await roleService.updateRole(roleId, req.body, next)
      return res.status(HttpStatus.OK.code).json({
        message: 'Role updated successfully',
        data: role
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { roleId } = req.params
      await roleService.deleteRole(roleId, next)
      return res.status(HttpStatus.OK.code).json({
        message: 'Role deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

export const roleController = new RoleController()
