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
exports.filterJobs = exports.filterCandidates = void 0;
const asyncHandler_1 = __importDefault(require("@app/middleware/asyncHandler"));
const db_1 = __importDefault(require("@app/db/db"));
//filter candidates based on different criteria:
exports.filterCandidates = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, location } = req.query;
    const titleFilter = title
        ? `%${title.toLowerCase().replace(/\s+/g, '')}%`
        : '%';
    const locationFilter = location
        ? `%${location.toLowerCase().replace(/\s+/g, '')}%`
        : '%';
    const result = yield db_1.default.query(`
    SELECT DISTINCT u.id, u.name, u.email, pd.title, pd.description, pd.location
    FROM users u
    JOIN portfolio_data pd ON pd.user_id = u.id
    WHERE u.role_id = (SELECT id FROM roles WHERE role_name = 'candidate')
      AND LOWER(REPLACE(pd.title, ' ', '')) LIKE $1
      AND LOWER(REPLACE(pd.location, ' ', '')) LIKE $2
    `, [titleFilter, locationFilter]);
    res.status(200).json({ candidates: result.rows });
}));
// Filter jobs by title and location
exports.filterJobs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title = "", location = "" } = req.query;
    const filters = [];
    const values = [];
    if (title) {
        filters.push("LOWER(REPLACE(title, ' ', '')) LIKE $" + (filters.length + 1));
        values.push(`%${title.toLowerCase().replace(/\s/g, "")}%`);
    }
    if (location) {
        filters.push("LOWER(REPLACE(location, ' ', '')) LIKE $" + (filters.length + 1));
        values.push(`%${location.toLowerCase().replace(/\s/g, "")}%`);
    }
    const query = `
      SELECT * FROM jobs
      ${filters.length ? "WHERE " + filters.join(" AND ") : ""}
      ORDER BY created_at DESC
    `;
    const result = yield db_1.default.query(query, values);
    res.status(200).json({ jobs: result.rows });
}));
