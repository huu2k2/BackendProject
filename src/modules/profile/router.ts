import { Router } from 'express'
import { profileController } from './controller'
import { isStaff, isCustomer, isAdmin } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isAdmin, profileController.createProfile.bind(profileController))
  .get(isStaff, isCustomer, isAdmin, profileController.getAllProfiles.bind(profileController))

router
  .route('/:profileId')
  .get(isStaff, isCustomer, isAdmin, profileController.getProfile.bind(profileController))
  .put(isAdmin, profileController.updateProfile.bind(profileController))

export default router
