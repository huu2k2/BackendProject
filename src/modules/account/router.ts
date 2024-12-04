import { Router } from 'express'
import { accountController } from './controller'
import { isManager, isStaff, isChef, isPermission } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isManager, accountController.createAccount.bind(accountController))
  .get(isPermission, accountController.getAccounts.bind(accountController))

router
  .route('/:accountId')
  .get(isPermission, accountController.getAccountById.bind(accountController))
  .put(isManager, accountController.updateAccount.bind(accountController))

export default router
