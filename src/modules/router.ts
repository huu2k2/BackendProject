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

const router = express.Router()

router.use(express.json())
router.use('/api/areas', areaRouter)
router.use('/api/customers', customerRouter)
router.use('/api/orders', orderRouter)
router.use('/api/payments', paymentRouter)
router.use('/api/accounts', accountRouter)
router.use('/api/profiles', profileRouter)
router.use('/api/roles', roleRouter)
router.use('/api/tables', tableRouter)
router.use('/api/products', productRouter)
router.use('/api/categories', categoryRouter)
router.use('/api', login)
export default router
