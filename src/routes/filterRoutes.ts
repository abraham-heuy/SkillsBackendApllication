import express  from "express";
import { filterCandidates, filterJobs } from "@app/controllers/filterController";

const router = express.Router();


router.get('/filter-candidates', filterCandidates);

router.get('/filter-jobs', filterJobs);

export default router 