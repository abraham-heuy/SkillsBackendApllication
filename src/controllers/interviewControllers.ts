import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import  pool from '@app/db/db';
import { UserRequest } from '@app/utils/types/userTypes';

export const getAllInterviews = asyncHandler(async (req: UserRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM interviews ORDER BY interview_date, interview_time');

    res.status(200).json(result.rows);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error fetching interviews:', err.message);
    } else {
      console.error('Unknown error:', err);
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export const createInterview = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { candidate_name, user_id, job_id, interview_date, interview_time, mode } = req.body;
  
      const result = await pool.query(
        `INSERT INTO interviews (candidate_name, user_id, job_id, interview_date, interview_time, mode)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [candidate_name, user_id, job_id, interview_date, interview_time, mode]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error creating interview:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  export const updateInterviewStatus = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const result = await pool.query(
        'UPDATE interviews SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Interview not found' });
        return 
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error updating interview status:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  