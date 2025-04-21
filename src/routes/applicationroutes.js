"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/applicationRoutes.ts
const express_1 = __importDefault(require("express"));
const applicationCotroller_1 = require("@app/controllers/applicationCotroller");
const router = express_1.default.Router();
// Candidate applies to a job
router.post('/apply', applicationCotroller_1.applyController);
exports.default = router;
