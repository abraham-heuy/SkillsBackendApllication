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
exports.getMatchedCandidatesController = exports.chatController = void 0;
const db_1 = __importDefault(require("@app/db/db"));
const geminiservice_1 = require("@app/services/geminiservice");
const chatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, userType, userId } = req.body;
    try {
        const query = yield (0, geminiservice_1.getIntentQuery)(message, userType);
        if (!query) {
            res.status(400).json({ message: 'No valid query returned from AI.' });
            return;
        }
        const result = yield db_1.default.query(query);
        const matchedRows = result.rows;
        // Determine result_type and matched IDs
        const resultType = userType.toLowerCase() === 'recruiter' ? 'candidates' : 'jobs';
        const resultIds = matchedRows.map((row) => row.id); // assuming 'id' is in each row
        // Save to search_logs
        yield db_1.default.query(`INSERT INTO search_logs (user_id, user_type, search_query, ai_sql_query, result_type, result_ids)
       VALUES ($1, $2, $3, $4, $5, $6)`, [userId, userType, message, query, resultType, resultIds]);
        res.status(200).json({ data: matchedRows });
    }
    catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ error: 'Failed to process request.' });
    }
});
exports.chatController = chatController;
const getMatchedCandidatesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const recruiterId = req.params.id;
    try {
        const logResult = yield db_1.default.query(`SELECT result_ids
       FROM search_logs
       WHERE user_id = $1 AND result_type = 'candidates'
       ORDER BY id DESC
       LIMIT 1`, [recruiterId]);
        if (logResult.rows.length === 0) {
            res.status(404).json({ message: 'No matched candidates found.' });
            return;
        }
        const resultIds = logResult.rows[0].result_ids;
        // Check if resultIds is a valid non-empty array
        if (!resultIds || resultIds.length === 0) {
            res.status(404).json({ message: 'No candidate IDs found in search logs.' });
            return;
        }
        const candidateResult = yield db_1.default.query(`SELECT 
         u.id AS user_id,
         u.name,
         u.email,
         pd.title,
         pd.location,
         pd.description,
         pd.organization,
         pd.section,
         pd.reference_contact
       FROM users u
       JOIN portfolio_data pd ON pd.user_id = u.id
       WHERE u.id = ANY($1)
         AND pd.section = 'experience'`, // use 'skills' or 'experience' depending on what you want
        [resultIds]);
        res.status(200).json({ matchedCandidates: candidateResult.rows });
    }
    catch (error) {
        console.error('Error fetching matched candidates:', error);
        res.status(500).json({ error: 'Server error while fetching matched candidates.' });
    }
});
exports.getMatchedCandidatesController = getMatchedCandidatesController;
