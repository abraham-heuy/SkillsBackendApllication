import express from 'express';
import { getAllInterviews, createInterview, updateInterviewStatus } from '@app/controllers/interviewControllers';

const router = express.Router();

router.get('/', getAllInterviews);
router.post('/',createInterview);
router.put('/:id/status', updateInterviewStatus);

export default router;
