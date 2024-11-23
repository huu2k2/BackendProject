import express from 'express'

import accountRouter from './account/router'
import profileRouter from './profile/router'
import roleRouter from './role/router'
import tableRouter from './table/router'
import productRouter from './product/router'
import categoryRouter from './category/router'
import areaRouter from './area/router'
import orderRouter from './order/router'
import paymentRouter from './payment/router'
import customerRouter from './customer/router'
import login from './login/router'
import notification from './notification/router'
import { isAuthenticated } from '../middleware/auth.middleware'

const router = express.Router()

router.use(express.json())
router.use('/api/areas', isAuthenticated, areaRouter)
router.use('/api/customers', customerRouter)
router.use('/api/orders', isAuthenticated, orderRouter)
router.use('/api/payments', isAuthenticated, paymentRouter)
router.use('/api/accounts', isAuthenticated, accountRouter)
router.use('/api/profiles', isAuthenticated, profileRouter)
router.use('/api/roles', isAuthenticated, roleRouter)
router.use('/api/tables', isAuthenticated, tableRouter)
router.use('/api/products', isAuthenticated, productRouter)
router.use('/api/categories', isAuthenticated, categoryRouter)
router.use('/api', login)
router.use('/api/notifications', notification )
export default router
