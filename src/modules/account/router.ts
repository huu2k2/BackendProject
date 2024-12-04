import { Router } from 'express'
import { accountController } from './controller'
import { isManager, isStaff, isChef } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isManager, accountController.createAccount.bind(accountController))
  .get(isManager || isStaff || isChef, accountController.getAccounts.bind(accountController))

router
  .route('/:accountId')
  .get(isManager || isStaff || isChef, accountController.getAccountById.bind(accountController))
  .put(isManager, accountController.updateAccount.bind(accountController))

export default router
