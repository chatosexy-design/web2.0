"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const students_1 = require("../controllers/students");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../types/roles");
const router = express_1.default.Router();
router.get('/parent/:code', students_1.getParentStats);
router.use(auth_1.protect);
router.use((0, auth_1.authorize)(roles_1.Roles.STUDENT));
router.get('/profile', students_1.getStudentProfile);
router.post('/log-ia', students_1.logFoodIA);
router.post('/log-dish', students_1.logDish);
router.get('/stats', students_1.getNutritionStats);
router.get('/history', students_1.getFoodHistory);
exports.default = router;
//# sourceMappingURL=students.js.map