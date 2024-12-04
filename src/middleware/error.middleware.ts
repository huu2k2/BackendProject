import { Request, Response, NextFunction } from 'express'

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    console.log(err)
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  })
}
