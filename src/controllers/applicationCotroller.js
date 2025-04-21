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
exports.applyController = void 0;
const db_1 = __importDefault(require("@app/db/db"));
const applyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, jobId } = req.body;
    try {
        // Prevent duplicate applications
        const check = yield db_1.default.query('SELECT * FROM applications WHERE user_id = $1 AND job_id = $2', [userId, jobId]);
        if (check.rows.length > 0) {
            res.status(409).json({ message: 'Already applied to this job.' });
            return;
        }
        yield db_1.default.query('INSERT INTO applications (user_id, job_id) VALUES ($1, $2)', [userId, jobId]);
        res.status(201).json({ message: 'Application submitted successfully.' });
    }
    catch (err) {
        console.error('Apply error:', err);
        res.status(500).json({ error: 'Failed to submit application.' });
    }
});
exports.applyController = applyController;
