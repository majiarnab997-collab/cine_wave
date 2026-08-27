import { Router } from 'express';
import { profileController } from '../controllers/profileController';

const router = Router();

router.get('/:userId', profileController.getProfiles);
router.post('/:userId', profileController.createProfile);
router.put('/:userId/:profileId', profileController.updateProfile);
router.delete('/:userId/:profileId', profileController.deleteProfile);

export default router;
