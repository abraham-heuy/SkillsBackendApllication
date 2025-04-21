// src/routes/applicationRoutes.ts
import express from 'express';
import {hireApplicant} from '@app/controllers/hiringController';

const router = express.Router();


// Recruiter hires an applicant
router.post('/hiring/:applicationId', hireApplicant);


export default router;
