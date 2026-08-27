import { Router } from 'express';
import { adminController } from '../controllers/adminController';

const router = Router();

router.get('/metrics', adminController.getMetrics);
router.get('/traffic', adminController.getTraffic);
router.get('/popular', adminController.getPopular);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserSuspension);
router.delete('/users/:id', adminController.deleteUser);
router.post('/movies', adminController.saveMovie);
router.delete('/movies/:id', adminController.deleteMovie);
router.post('/shows', adminController.saveShow);
router.delete('/shows/:id', adminController.deleteShow);
router.get('/activity', adminController.getActivityLogs);

export default router;
