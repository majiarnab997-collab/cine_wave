import { Router } from 'express';
import { watchlistController } from '../controllers/watchlistController';

const router = Router();

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:profileId/:mediaId', watchlistController.removeFromWatchlist);

export default router;
