import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ERole } from '../common/enum'
import { ApiError } from './error.middleware'

declare global {
  namespace Express {
    interface Request {
      user: any
    }
  }
}
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req?.headers?.authorization

  if (!authHeader) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  const token = authHeader?.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  req.user = decoded
  next()
}

export const isCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.CUSTOMER) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next()
}

export const isStaff = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.STAFF) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next()
}

export const isManager = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.ADMIN) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next(new ApiError(401, 'Unauthorized!'))
}

export const isManagerOrStaff = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.ADMIN && req.user.role.name !== ERole.STAFF) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next()
}

export const isManagerOrCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.ADMIN && req.user.role.name !== ERole.CUSTOMER) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next()
}

export const isStaffOrCustomer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.STAFF && req.user.role.name !== ERole.CUSTOMER) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next()
}

export const isChefOrCustomerOrStaff = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.user.role.name !== ERole.CHEFF &&
    req.user.role.name !== ERole.CUSTOMER &&
    req.user.role.name !== ERole.STAFF
  ) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next()
}

export const isChef = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name !== ERole.CHEFF) {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
  next()
}

export const isPermission = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role.name === ERole.CHEFF || req.user.role.name === ERole.ADMIN || req.user.role.name === ERole.STAFF) {
    next()
  } else {
    throw new ApiError(401, 'You are not authorized to access this resource')
  }
}
