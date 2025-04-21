"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersControllers_1 = require("../controllers/usersControllers");
const protect_1 = require("../middleware/auth/protect");
const router = express_1.default.Router();
//public routes 
//  - go the route of api.v1/users
// - then check if they are logged in 
// -  check if they are admin then
// - get the users - controller
// Modify userRoutes.ts to: ✅ Require authentication (protect) before accessing routes.
// ✅ Use role-based guards (adminGuard) to limit access.
// ✅ Admins can manage users (CRUD).
// ✅ Regular users (Organizers & Attendees) cannot modify users.
// ✅ Public registration remains open (POST /users).
router.get("/", usersControllers_1.getUsers);
router.put("/:id", protect_1.protect, usersControllers_1.updateUser);
router.get("/:id", protect_1.protect, usersControllers_1.getUserById);
router.delete("/:id", usersControllers_1.deleteUsers);
exports.default = router;
