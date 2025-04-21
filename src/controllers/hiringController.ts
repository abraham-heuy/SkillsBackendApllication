// src/controllers/hireOrRejectController.ts
import { Request, Response } from 'express';
import pool from '@app/db/db';
import asyncHandler from '@app/middleware/asyncHandler';

export const hireApplicant = asyncHandler(async (req: Request, res: Response) => {
    const { recruiterId, action } = req.body; // action: 'hire' or 'reject'
    const { applicationId } = req.params;

    try {
        const appResult = await pool.query(
            'SELECT * FROM applications WHERE id = $1',
            [applicationId]
        );

        const application = appResult.rows[0];

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        const userId = application.user_id;
        const jobId = application.job_id;

        if (action === 'hire') {
            // Insert into hiring table
            await pool.query(
                'INSERT INTO hiring (recruiter_id, user_id, job_id) VALUES ($1, $2, $3)',
                [recruiterId, userId, jobId]
            );

            // Notify applicant
            await pool.query(
                'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
                [userId, '🎉 Congratulations! You have been hired for the position you applied for.']
            );

            // Notify recruiter
            await pool.query(
                'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
                [recruiterId, `✅ You have successfully hired user ID ${userId} for job ID ${jobId}.`]
            );

            // Remove the application
            await pool.query('DELETE FROM applications WHERE id = $1', [applicationId]);

            return res.status(200).json({ message: 'Candidate hired successfully and notifications sent.' });

        } else if (action === 'reject') {
            // Update application status
            await pool.query(
                'UPDATE applications SET status = $1 WHERE id = $2',
                ['rejected', applicationId]
            );

            // Notify applicant
            await pool.query(
                'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
                [userId, '❌ Unfortunately, your job application has been rejected. We wish you better luck next time.']
            );

            // Notify recruiter
            await pool.query(
                'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
                [recruiterId, `🗂 You have rejected user ID ${userId} for job ID ${jobId}.`]
            );

            return res.status(200).json({ message: 'Candidate rejected and notifications sent.' });

        } else {
            return res.status(400).json({ message: 'Invalid action. Use "hire" or "reject".' });
        }

    } catch (err) {
        console.error('Hire/Reject error:', err);
        return res.status(500).json({ error: 'Failed to process action.' });
    }
});
