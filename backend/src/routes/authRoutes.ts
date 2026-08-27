import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);
router.post('/demo', authController.demoLogin);
router.post('/signup', authController.signup);
router.get('/me/:userId', authController.getCurrentUser);
router.put('/plan', authController.updatePlan);

export default router;
