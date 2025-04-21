"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../db/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/helpers/generateToken");
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// Register User
exports.registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role_id } = req.body;
    const userExists = yield db_1.default.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    const newUser = yield db_1.default.query(`INSERT INTO users (name, email, password, role_id) 
         VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id`, [name, email, hashedPassword, role_id]);
    const user = newUser.rows[0];
    (0, generateToken_1.generateToken)(res, user.id, user.role_id);
    res.status(201).json({
        message: "User registered successfully",
        user
    });
}));
// Login User
exports.loginUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userQuery = yield db_1.default.query(`SELECT users.id, users.name, users.email, users.password, users.role_id, roles.role_name
         FROM users
         JOIN roles ON users.role_id = roles.id
         WHERE users.email = $1`, [email]);
    if (userQuery.rows.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const user = userQuery.rows[0];
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    (0, generateToken_1.generateToken)(res, user.id, user.role_id);
    res.status(200).json({
        message: "Login successful",
        token: "mocked_or_generated_token_if_needed",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name,
        },
    });
}));
// Logout User
exports.logoutUser = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ message: "User logged out successfully" });
}));
