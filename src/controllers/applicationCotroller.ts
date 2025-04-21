// src/controllers/applyController.ts
import { Request, Response } from 'express';
import pool from '@app/db/db';

export const applyController = async (req: Request, res: Response) => {
  const { userId, jobId } = req.body;

  try {
    // Prevent duplicate applications
    const check = await pool.query(
      'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );

    if (check.rows.length > 0) {
      res.status(409).json({ message: 'Already applied to this job.' });
      return 
    }

    await pool.query(
      'INSERT INTO applications (user_id, job_id) VALUES ($1, $2)',
      [userId, jobId]
    );

    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
};
