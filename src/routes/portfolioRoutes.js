"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const portofoliocontroller_1 = require("@app/controllers/portofoliocontroller");
const router = express_1.default.Router();
// Sections
const sections = ['projects', 'experience', 'education', 'certifications', 'references'];
sections.forEach(section => {
    router.get(`/${section}`, (0, portofoliocontroller_1.getAllSectionItems)(section));
    router.get(`/${section}/:id`, (0, portofoliocontroller_1.getSectionItemById)(section));
    router.post(`/${section}`, (0, portofoliocontroller_1.createSectionItem)(section));
    router.put(`/${section}/:id`, (0, portofoliocontroller_1.updateSectionItem)(section));
    router.delete(`/${section}/:id`, (0, portofoliocontroller_1.deleteSectionItem)(section));
});
exports.default = router;
