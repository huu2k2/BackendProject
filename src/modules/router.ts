import express from 'express'

import accountRouter from './account/router'
import profileRouter from './profile/router'
import roleRouter from './role/router'
import tableRouter from './table/router'
import productRouter from './product/router'
import categoryRouter from './category/router'
import areaRouter from './area/router'
import notificationRouter from './notification/router'
import orderRouter from './order/router'
import paymentRouter from './payment/router'
import customerRouter from './customer/router'
import login from './login/router'
import health from './health/router'
import logout from './logout/router'
import { isAuthenticated } from '../middleware/auth.middleware'

const router = express.Router()

router.use(express.json())
router.use('/areas', isAuthenticated, areaRouter)
router.use('/notifications', notificationRouter)
router.use('/customers', customerRouter)
router.use('/orders', isAuthenticated, orderRouter)
router.use('/payments', isAuthenticated, paymentRouter)
router.use('/accounts', isAuthenticated, accountRouter)
router.use('/profiles', isAuthenticated, profileRouter)
router.use('/roles', isAuthenticated, roleRouter)
router.use('/tables', isAuthenticated, tableRouter)
router.use('/products', isAuthenticated, productRouter)
router.use('/categories', isAuthenticated, categoryRouter)
router.use('/', login)
router.use('/logout',logout)

router.use('/health', health);
export default router
