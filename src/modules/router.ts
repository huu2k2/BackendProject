import express from 'express'

import accountRouter from './account/router'
import profileRouter from './profile/router'
import roleRouter from './role/router'
import tableRouter from './table/router'
import productRouter from './product/router'
import categoryRouter from './category/router'
const router = express.Router()

router.use(express.json())
router.use('/api/accounts', accountRouter)
router.use('/api/profiles', profileRouter)
router.use('/api/roles', roleRouter)
router.use('/api/tables', tableRouter)
router.use('/api/products', productRouter)
router.use('/api/categories', categoryRouter)
export default router
