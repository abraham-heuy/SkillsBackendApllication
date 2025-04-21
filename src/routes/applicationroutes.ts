// src/routes/applicationRoutes.ts
import express from 'express';
import {applyController} from '@app/controllers/applicationCotroller';

const router = express.Router();

// Candidate applies to a job
router.post('/apply', applyController);


export default router;
