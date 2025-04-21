import express from 'express'
import { createJob, deleteJob, getAllJobs, getJobById, updateJob } from '@app/controllers/jobController'

const router = express.Router()

router.get("/", getAllJobs)
router.post("/createJob", createJob)
router.get("/:id", getJobById)
router.put("/:id", updateJob)
router.delete("/:id", deleteJob)

export default router