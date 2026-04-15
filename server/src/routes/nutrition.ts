import { Router } from 'express';
import { analyzeNutrition } from '../controllers/nutrition';
import { protect } from '../middleware/auth';

const router = Router();

// /api/nutrition/analyze
router.post('/analyze', protect, analyzeNutrition);

export default router;
