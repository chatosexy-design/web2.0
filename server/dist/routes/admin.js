"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.use((0, auth_1.authorize)(client_1.Role.ADMIN));
router.get('/stats', admin_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=admin.js.map