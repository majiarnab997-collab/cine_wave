import { Router } from 'express';
import { mediaController } from '../controllers/mediaController';

const router = Router();

router.get('/', mediaController.getAll);
router.get('/featured', mediaController.getFeatured);
router.get('/trending', mediaController.getTrending);
router.get('/top10', mediaController.getTopTen);
router.get('/genres', mediaController.getGenres);
router.get('/:id', mediaController.getById);
router.get('/:id/similar', mediaController.getSimilar);

export default router;
