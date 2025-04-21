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
exports.deleteSectionItem = exports.updateSectionItem = exports.createSectionItem = exports.getSectionItemById = exports.getAllSectionItems = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("@app/db/db"));
// Generic function to get all items in a section
const getAllSectionItems = (section) => (0, express_async_handler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query("SELECT * FROM portfolio_data WHERE section = $1", [section]);
    res.status(200).json(result.rows);
}));
exports.getAllSectionItems = getAllSectionItems;
// Get one item by ID
const getSectionItemById = (section) => (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield db_1.default.query("SELECT * FROM portfolio_data WHERE id = $1 AND section = $2", [id, section]);
    if (result.rows.length === 0) {
        res.status(404).json({ message: `${section} not found` });
        return;
    }
    res.status(200).json(result.rows[0]);
}));
exports.getSectionItemById = getSectionItemById;
// Create item
const createSectionItem = (section) => (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, start_date, end_date, organization, location, user_id, reference_contact } = req.body;
    if (!user_id) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const result = yield db_1.default.query(`
        INSERT INTO portfolio_data (user_id, section, title, description, start_date, end_date, organization, location,reference_contact)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `, [user_id, section, title, description, start_date, end_date, organization, location, reference_contact]);
    res.status(201).json(result.rows[0]);
}));
exports.createSectionItem = createSectionItem;
// Update item
const updateSectionItem = (section) => (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, start_date, end_date, organization, location } = req.body;
    const result = yield db_1.default.query(`
        UPDATE portfolio_data SET 
        title = $1, description = $2, start_date = $3, end_date = $4, 
        organization = $5, location = $6
        WHERE id = $7 AND section = $8
        RETURNING *
    `, [title, description, start_date, end_date, organization, location, id, section]);
    if (result.rows.length === 0) {
        res.status(404).json({ message: `${section} not found` });
        return;
    }
    res.status(200).json(result.rows[0]);
}));
exports.updateSectionItem = updateSectionItem;
// Delete item
const deleteSectionItem = (section) => (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield db_1.default.query("DELETE FROM portfolio_data WHERE id = $1 AND section = $2 RETURNING *", [id, section]);
    if (result.rows.length === 0) {
        res.status(404).json({ message: `${section} not found` });
        return;
    }
    res.status(200).json({ message: `${section} deleted successfully` });
}));
exports.deleteSectionItem = deleteSectionItem;
