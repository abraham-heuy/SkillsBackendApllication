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
exports.updateInterviewStatus = exports.createInterview = exports.getAllInterviews = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("@app/db/db"));
exports.getAllInterviews = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM interviews ORDER BY interview_date, interview_time');
        res.status(200).json(result.rows);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('Error fetching interviews:', err.message);
        }
        else {
            console.error('Unknown error:', err);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.createInterview = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { candidate_name, user_id, job_id, interview_date, interview_time, mode } = req.body;
        const result = yield db_1.default.query(`INSERT INTO interviews (candidate_name, user_id, job_id, interview_date, interview_time, mode)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [candidate_name, user_id, job_id, interview_date, interview_time, mode]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('Error creating interview:', err.message);
        }
        else {
            console.error('Unknown error:', err);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.updateInterviewStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = yield db_1.default.query('UPDATE interviews SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('Error updating interview status:', err.message);
        }
        else {
            console.error('Unknown error:', err);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
