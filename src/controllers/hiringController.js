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
exports.hireApplicant = void 0;
const db_1 = __importDefault(require("@app/db/db"));
const asyncHandler_1 = __importDefault(require("@app/middleware/asyncHandler"));
exports.hireApplicant = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recruiterId, action } = req.body; // action: 'hire' or 'reject'
    const { applicationId } = req.params;
    try {
        const appResult = yield db_1.default.query('SELECT * FROM applications WHERE id = $1', [applicationId]);
        const application = appResult.rows[0];
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }
        const userId = application.user_id;
        const jobId = application.job_id;
        if (action === 'hire') {
            // Insert into hiring table
            yield db_1.default.query('INSERT INTO hiring (recruiter_id, user_id, job_id) VALUES ($1, $2, $3)', [recruiterId, userId, jobId]);
            // Notify applicant
            yield db_1.default.query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [userId, '🎉 Congratulations! You have been hired for the position you applied for.']);
            // Notify recruiter
            yield db_1.default.query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [recruiterId, `✅ You have successfully hired user ID ${userId} for job ID ${jobId}.`]);
            // Remove the application
            yield db_1.default.query('DELETE FROM applications WHERE id = $1', [applicationId]);
            return res.status(200).json({ message: 'Candidate hired successfully and notifications sent.' });
        }
        else if (action === 'reject') {
            // Update application status
            yield db_1.default.query('UPDATE applications SET status = $1 WHERE id = $2', ['rejected', applicationId]);
            // Notify applicant
            yield db_1.default.query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [userId, '❌ Unfortunately, your job application has been rejected. We wish you better luck next time.']);
            // Notify recruiter
            yield db_1.default.query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [recruiterId, `🗂 You have rejected user ID ${userId} for job ID ${jobId}.`]);
            return res.status(200).json({ message: 'Candidate rejected and notifications sent.' });
        }
        else {
            return res.status(400).json({ message: 'Invalid action. Use "hire" or "reject".' });
        }
    }
    catch (err) {
        console.error('Hire/Reject error:', err);
        return res.status(500).json({ error: 'Failed to process action.' });
    }
}));
