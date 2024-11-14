import { Router } from 'express'
import { accountController } from './controller'

const router = Router()

router
  .route('/')
  .post(accountController.createAccount.bind(accountController))
  .get(accountController.getAccounts.bind(accountController))

router
  .route('/:accountId')
  .get(accountController.getAccountById.bind(accountController))
  .put(accountController.updateAccount.bind(accountController))

export default router
