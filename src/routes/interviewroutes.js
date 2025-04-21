"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewControllers_1 = require("@app/controllers/interviewControllers");
const router = express_1.default.Router();
router.get('/', interviewControllers_1.getAllInterviews);
router.post('/', interviewControllers_1.createInterview);
router.put('/:id/status', interviewControllers_1.updateInterviewStatus);
exports.default = router;
