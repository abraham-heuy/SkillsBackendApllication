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
exports.getIntentQuery = getIntentQuery;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
function getIntentQuery(message, userType) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
You are an assistant for a job-matching platform. The user is a ${userType}.
Based on the message: "${message}", return a valid SQL SELECT query for PostgreSQL.

Only respond with the SQL query.
Do not include any explanation, markdown formatting (like \`\`\`), or HTML tags.

Tables:
- users(id, name, email, role_id)
- jobs(id, title, description, company_name, recruiter_id, created_at, required_skills)
- portfolio_data(id, user_id, section, title, description, start_date, end_date, organization, location,reference_data)

Make sure to handle 'required_skills' as an array. For example, if searching for a skill 'java', use the ANY operator.
`;
        const result = yield model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }],
                },
            ],
        });
        const response = result.response;
        let query = response.text().trim();
        // Clean up any accidental formatting like markdown or HTML tags
        query = query.replace(/```sql|```|<[^>]+>/gi, '').trim();
        // Optional: Only allow SELECT statements for safety
        if (!/^select\s/i.test(query)) {
            throw new Error('Only SELECT queries are allowed.');
        }
        return query;
    });
}
