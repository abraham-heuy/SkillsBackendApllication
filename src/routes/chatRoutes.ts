import express from 'express';
import { chatController, getMatchedCandidatesController } from '@app/controllers/AISController';

const router = express.Router();

router.post('/chatroute', chatController);
router.get('/matched-candidates/:id', getMatchedCandidatesController);

export default router; 
