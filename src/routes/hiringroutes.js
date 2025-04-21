"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/applicationRoutes.ts
const express_1 = __importDefault(require("express"));
const hiringController_1 = require("@app/controllers/hiringController");
const router = express_1.default.Router();
// Recruiter hires an applicant
router.post('/hiring/:applicationId', hiringController_1.hireApplicant);
exports.default = router;
