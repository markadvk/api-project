import { Router } from 'express';
import { delRemove, getAll, postCreate, putUpdate } from '../controllers/tableController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAll);                    // public read
router.post('/', requireAuth, postCreate);  // create
router.put('/:id', requireAuth, putUpdate); // update
router.delete('/:id', requireAuth, delRemove); // delete

export default router;