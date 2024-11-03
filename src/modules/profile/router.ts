import { Router } from 'express';
import { profileController } from './controller';
 

const router = Router();

router
  .route('/')
  .post( profileController.createProfile.bind(profileController))
  .get(profileController.getAllProfiles.bind(profileController));

router
  .route('/:profileId')
  .get(profileController.getProfile.bind(profileController))
  .put(profileController.updateProfile.bind(profileController))
  .delete(profileController.deleteProfile.bind(profileController));

export default router;