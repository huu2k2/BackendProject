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
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return ApiResponse.badRequest(res, 'No token provided')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded

    next()
  } catch (error) {
    return ApiResponse.error(res, error, 'Invalid token')
  }
}

export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== ERole.CUSTOMER) {
    return ApiResponse.badRequest(res, 'You are not authorized to access this resource')
  }
  next()
}

export const isStaff = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== ERole.STAFF) {
    return ApiResponse.badRequest(res, 'You are not authorized to access this resource')
  }
  next()
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== ERole.ADMIN) {
    return ApiResponse.badRequest(res, 'You are not authorized to access this resource')
  }
  next()
}

export const isChef = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== ERole.CHEFF) {
    return ApiResponse.badRequest(res, 'You are not authorized to access this resource')
  }
  next()
}
