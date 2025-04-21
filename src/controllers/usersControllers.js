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
exports.deleteUsers = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const db_1 = __importDefault(require("../db/db"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
//Only admins should get all users
exports.getUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`
        SELECT 
            users.id, 
            users.name, 
            users.email, 
            users.role_id, 
            portfolio_data.title, 
            portfolio_data.description, 
            portfolio_data.location
        FROM users
        LEFT JOIN portfolio_data ON users.id = portfolio_data.user_id
        ORDER BY users.id ASC
    `);
    res.status(200).json(result.rows);
}));
//get user by id:
exports.getUserById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield db_1.default.query("SELECT user_id, name, email, role_id FROM users WHERE user_id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
//update the user profile: 
exports.updateUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, role_id } = req.body;
        if (!name && !email && !role_id) {
            return res.status(400).json({ message: "No update fields provided." });
        }
        const result = yield db_1.default.query(`UPDATE users SET 
        name = COALESCE($1, name), 
        email = COALESCE($2, email), 
        role_id = COALESCE($3, role_id) 
       WHERE user_id = $4 RETURNING user_id, name, email, role_id`, [name, email, role_id, id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
//delete the user
exports.deleteUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(500).json({
                message: "No user Id found"
            });
        }
        const result = yield db_1.default.query("DELETE FROM users WHERE id = $1;", [id]);
        if (result.rowCount == 0) {
            res.status(500).json({
                message: "User Not Found😕😔"
            });
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
}));
