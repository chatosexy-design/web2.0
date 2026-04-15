
const express = require('express');
const router = express.Router();
const { searchNutrition, getNutritionInfo } = require('../controllers/nutritionController');

router.get('/search', searchNutrition);
router.get('/info/:id', getNutritionInfo);

module.exports = router;
