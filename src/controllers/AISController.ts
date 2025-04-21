// src/controllers/chatController.ts
import { Request, Response } from 'express';
import pool from '@app/db/db';
import { getIntentQuery } from '@app/services/geminiservice';

export const chatController = async (req: Request, res: Response) => {
  const { message, userType, userId } = req.body;

  try {
    const query = await getIntentQuery(message, userType);

    if (!query) {
      res.status(400).json({ message: 'No valid query returned from AI.' });
      return 
    }

    const result = await pool.query(query);
    const matchedRows = result.rows;

    // Determine result_type and matched IDs
    const resultType = userType.toLowerCase() === 'recruiter' ? 'candidates' : 'jobs';
    const resultIds = matchedRows.map((row: any) => row.id); // assuming 'id' is in each row

    // Save to search_logs
    await pool.query(
      `INSERT INTO search_logs (user_id, user_type, search_query, ai_sql_query, result_type, result_ids)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, userType, message, query, resultType, resultIds]
    );

    res.status(200).json({ data: matchedRows });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process request.' });
  }
};

export const getMatchedCandidatesController = async (req: Request, res: Response) => {
  const recruiterId = req.params.id;

  try {
    const logResult = await pool.query(
      `SELECT result_ids
       FROM search_logs
       WHERE user_id = $1 AND result_type = 'candidates'
       ORDER BY id DESC
       LIMIT 1`,
      [recruiterId]
    );

    if (logResult.rows.length === 0) {
      res.status(404).json({ message: 'No matched candidates found.' });
      return 
    }

    const resultIds = logResult.rows[0].result_ids;

    // Check if resultIds is a valid non-empty array
    if (!resultIds || resultIds.length === 0) {
      res.status(404).json({ message: 'No candidate IDs found in search logs.' });
      return 
    }

    const candidateResult = await pool.query(
      `SELECT 
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
      [resultIds]
    );

    res.status(200).json({ matchedCandidates: candidateResult.rows });
  } catch (error) {
    console.error('Error fetching matched candidates:', error);
    res.status(500).json({ error: 'Server error while fetching matched candidates.' });
  }
};


