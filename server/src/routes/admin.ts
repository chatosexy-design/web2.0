import express from 'express';
import { getDashboardStats } from '../controllers/admin';
import { protect, authorize } from '../middleware/auth';
import { Roles } from '../types/roles';

const router = express.Router();

router.use(protect);
router.use(authorize(Roles.ADMIN));

router.get('/stats', getDashboardStats);

export default router;
