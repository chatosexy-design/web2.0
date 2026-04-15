import express from 'express';
import { getStudentProfile, logFoodIA, getNutritionStats } from '../controllers/students';
import { protect, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.use(protect);
router.use(authorize(Role.STUDENT));

router.get('/profile', getStudentProfile);
router.post('/log-ia', logFoodIA);
router.get('/stats', getNutritionStats);

export default router;
