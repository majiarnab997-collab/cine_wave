import { Router } from 'express';
import { playbackController } from '../controllers/playbackController';

const router = Router();

router.get('/continue-watching', playbackController.getContinueWatching);
router.post('/progress', playbackController.updateProgress);
router.delete('/progress/:profileId/:mediaId', playbackController.removeProgress);
router.get('/history', playbackController.getHistory);
router.delete('/history/:profileId', playbackController.clearHistory);

export default router;
