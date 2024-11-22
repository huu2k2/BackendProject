import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/response.util'
import { ERole } from '../common/enum'

declare global {
  namespace Express {
    interface Request {
      user: any
    }
  }
}
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req?.headers?.authorization

    if (!authHeader) {
      throw new Error('Authorization header is missing')
    }
    const token = authHeader?.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (error) {
    next(ApiResponse.error(res, error, 'Invalid token'))
  }
}

export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  console.log(1, req.user)
  if (req.user.role.name !== ERole.CUSTOMER) {
    next(ApiResponse.badRequest(res, 'You are not authorized to access this resource'))
  }
  next()
}

export const isStaff = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.STAFF) {
    next(ApiResponse.badRequest(res, 'You are not authorized to access this resource'))
  }
  next()
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.ADMIN) {
    next(ApiResponse.badRequest(res, 'You are not authorized to access this resource'))
  }
  next()
}

export const isAdminOrCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.ADMIN && req.user.role.name !== ERole.CUSTOMER) {
    next(ApiResponse.badRequest(res, 'You are not authorized to access this resource'))
  }
  next()
}

export const isStaffOrCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.STAFF && req.user.role.name !== ERole.CUSTOMER) {
    next(ApiResponse.badRequest(res, 'You are not authorized to access this resource'))
  }
  next()
}

export const isChefOrCustomerOrStaff = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.user.role.name !== ERole.CHEFF &&
    req.user.role.name !== ERole.CUSTOMER &&
    req.user.role.name !== ERole.STAFF
  ) {
    next(ApiResponse.badRequest(res, 'You are not authorized to access this resource'))
  }
  next()
}

export const isChef = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.CHEFF) {
    next(ApiResponse.badRequest(res, 'You are not authorized to access this resource'))
  }
  next()
}
