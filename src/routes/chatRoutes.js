"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AISController_1 = require("@app/controllers/AISController");
const router = express_1.default.Router();
router.post('/chatroute', AISController_1.chatController);
router.get('/matched-candidates/:id', AISController_1.getMatchedCandidatesController);
exports.default = router;
