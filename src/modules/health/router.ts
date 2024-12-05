import { Router, Request, Response, NextFunction } from 'express'
import { HttpStatus } from '../../utils/HttpStatus'

const router = Router()

router.route('/').get(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  return res.status(HttpStatus.OK.code).json({ status: 'OK' })
})

export default router
