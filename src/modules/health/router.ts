import { Router, Request, Response, NextFunction } from 'express'

const router = Router()

router.route('/').get(async(req: Request, res: Response, next: NextFunction):Promise<any> => {
  return res.status(200).json({ status: 'OK' })
})

export default router
