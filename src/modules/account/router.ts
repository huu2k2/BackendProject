import { Router } from 'express'
import { accountController } from './controller'
import { isAdmin, isStaff, isChef } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isAdmin, accountController.createAccount.bind(accountController))
  .get(isAdmin || isStaff || isChef, accountController.getAccounts.bind(accountController))

router
  .route('/:accountId')
  .get(isAdmin || isStaff || isChef, accountController.getAccountById.bind(accountController))
  .put(isAdmin, accountController.updateAccount.bind(accountController))

export default router
