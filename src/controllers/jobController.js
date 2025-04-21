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
exports.deleteJob = exports.updateJob = exports.getJobById = exports.createJob = exports.getAllJobs = void 0;
const db_1 = __importDefault(require("@app/db/db"));
const asyncHandler_1 = __importDefault(require("@app/middleware/asyncHandler"));
//get all jobs? 
exports.getAllJobs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM jobs ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('Error fetching jobs:', err.message);
        }
        else {
            console.error('Unknown error:', err);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//post a job
exports.createJob = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, company_name, required_skills, location } = req.body;
        const recruiter_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!title || !description || !required_skills || !location) {
            res.status(400).json({ message: 'Title, description, skills, and location are required.' });
            return;
        }
        const skillsArray = required_skills.split(',').map((skill) => skill.trim());
        const result = yield db_1.default.query(`INSERT INTO jobs (title, description, company_name, recruiter_id, required_skills, location)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [title, description, company_name, recruiter_id, skillsArray, location]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('Error creating job:', err instanceof Error ? err.message : err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//get a job by id
exports.getJobById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield db_1.default.query('SELECT * FROM jobs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('Error fetching job:', err.message);
        }
        else {
            console.error('Unknown error:', err);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//update the existing jobs 
exports.updateJob = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { title, description, company_name, required_skills, location } = req.body;
        const recruiter_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const skillsArray = required_skills === null || required_skills === void 0 ? void 0 : required_skills.split(',').map((skill) => skill.trim());
        const result = yield db_1.default.query(`UPDATE jobs 
       SET title = $1, description = $2, company_name = $3, required_skills = $4, location = $5
       WHERE id = $6 AND recruiter_id = $7 RETURNING *`, [title, description, company_name, skillsArray, location, id, recruiter_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Job not found or unauthorized' });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error('Error updating job:', err instanceof Error ? err.message : err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//delete a job??
exports.deleteJob = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Log to check the job ID
        console.log('Deleting job with ID:', id);
        const result = yield db_1.default.query(`DELETE FROM jobs 
       WHERE id = $1 RETURNING *`, // Removed recruiter_id check
        [id]);
        if (result.rows.length === 0) {
            console.log('No matching job found for deletion');
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting job:', err instanceof Error ? err.message : err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
