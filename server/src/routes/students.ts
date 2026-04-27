import express from 'express';
import { getStudentProfile, logFoodIA, getNutritionStats, getFoodHistory, getParentStats } from '../controllers/students';
import { protect, authorize } from '../middleware/auth';
import { Roles } from '../types/roles';

const router = express.Router();

router.get('/parent/:code', getParentStats);

router.use(protect);
router.use(authorize(Roles.STUDENT));

router.get('/profile', getStudentProfile);
router.post('/log-ia', logFoodIA);
router.get('/stats', getNutritionStats);
router.get('/history', getFoodHistory);

export default router;
