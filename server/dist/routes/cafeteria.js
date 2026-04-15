"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cafeteria_1 = require("../controllers/cafeteria");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Public: view menu
router.get('/', cafeteria_1.getDishes);
// Private: manage menu
router.use(auth_1.protect);
router.use((0, auth_1.authorize)(client_1.Role.CAFETERIA, client_1.Role.ADMIN));
router.post('/', cafeteria_1.createDish);
router.put('/:id', cafeteria_1.updateDish);
router.delete('/:id', cafeteria_1.deleteDish);
exports.default = router;
//# sourceMappingURL=cafeteria.js.map