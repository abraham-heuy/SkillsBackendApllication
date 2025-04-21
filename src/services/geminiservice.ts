import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getIntentQuery(message: string, userType: string): Promise<string> {
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

  const result = await model.generateContent({
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
}
