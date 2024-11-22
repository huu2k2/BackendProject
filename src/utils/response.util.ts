import { Response } from 'express'

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data
    })
  }
  static created(res: Response, message: string = 'Created') {
    return res.status(201).json({
      success: true,
      message
    })
  }

  static error(res: Response, error: any, message: string = 'Internal server error') {
    console.error(error)
    return res.status(500).json({
      success: false,
      message,
      error: error.message
    })
  }

  static notFound(res: Response, message: string = 'Not found') {
    return res.status(404).json({
      success: false,
      message
    })
  }

  static badRequest(res: Response, message: string = 'Bad request') {
    return res.status(400).json({
      success: false,
      message
    })
  }
}
