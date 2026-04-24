import express from 'express';
import { getDishes, createDish, updateDish, deleteDish } from '../controllers/cafeteria';
import { protect, authorize } from '../middleware/auth';
import { Roles } from '../types/roles';

const router = express.Router();

// Public: view menu
router.get('/', getDishes);

// Private: manage menu
router.use(protect);
router.use(authorize(Roles.CAFETERIA, Roles.ADMIN));

router.post('/', createDish);
router.put('/:id', updateDish);
router.delete('/:id', deleteDish);

export default router;
