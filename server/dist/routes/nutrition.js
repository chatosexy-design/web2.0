"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nutrition_1 = require("../controllers/nutrition");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// /api/nutrition/analyze
router.post('/analyze', auth_1.protect, nutrition_1.analyzeNutrition);
exports.default = router;
//# sourceMappingURL=nutrition.js.map