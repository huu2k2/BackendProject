import { Router } from 'express'
import { profileController } from './controller'
import { isStaff, isManager } from '../../middleware/auth.middleware'

const router = Router()

router
  .route('/')
  .post(isManager, profileController.createProfile.bind(profileController))
  .get(isStaff || isManager, profileController.getAllProfiles.bind(profileController))

router
  .route('/:profileId')
  .get(isStaff || isManager, profileController.getProfile.bind(profileController))
  .put(isManager, profileController.updateProfile.bind(profileController))

export default router
