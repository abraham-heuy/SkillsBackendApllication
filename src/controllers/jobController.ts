import { Request, Response, NextFunction } from "express";
import pool from "@app/db/db";
import asyncHandler from "@app/middleware/asyncHandler";
import { User, UserRequest } from "@app/utils/types/userTypes";
 //get all jobs? 
 export const getAllJobs = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error fetching jobs:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


//post a job
export const createJob = asyncHandler(async (req: UserRequest, res: Response) => {
  try {
    const { title, description, company_name, required_skills, location } = req.body;
    const recruiter_id = req.user?.id;

    if (!title || !description || !required_skills || !location) {
      res.status(400).json({ message: 'Title, description, skills, and location are required.' });
      return 
    }

    const skillsArray = required_skills.split(',').map((skill: string) => skill.trim());

    const result = await pool.query(
      `INSERT INTO jobs (title, description, company_name, recruiter_id, required_skills, location)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, company_name, recruiter_id, skillsArray, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    console.error('Error creating job:', err instanceof Error ? err.message : err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get a job by id
export const getJobById = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error fetching job:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

//update the existing jobs 
export const updateJob = asyncHandler(async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, company_name, required_skills, location } = req.body;
    const recruiter_id = req.user?.id;

    const skillsArray = required_skills?.split(',').map((skill: string) => skill.trim());

    const result = await pool.query(
      `UPDATE jobs 
       SET title = $1, description = $2, company_name = $3, required_skills = $4, location = $5
       WHERE id = $6 AND recruiter_id = $7 RETURNING *`,
      [title, description, company_name, skillsArray, location, id, recruiter_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Job not found or unauthorized' });
      return
    }

    res.status(200).json(result.rows[0]);
  } catch (err: unknown) {
    console.error('Error updating job:', err instanceof Error ? err.message : err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//delete a job??
export const deleteJob = asyncHandler(async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Log to check the job ID
    console.log('Deleting job with ID:', id);

    const result = await pool.query(
      `DELETE FROM jobs 
       WHERE id = $1 RETURNING *`,  // Removed recruiter_id check
      [id]
    );

    if (result.rows.length === 0) {
      console.log('No matching job found for deletion');
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting job:', err instanceof Error ? err.message : err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


 
