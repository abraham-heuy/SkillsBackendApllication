"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filterController_1 = require("@app/controllers/filterController");
const router = express_1.default.Router();
router.get('/filter-candidates', filterController_1.filterCandidates);
router.get('/filter-jobs', filterController_1.filterJobs);
exports.default = router;
