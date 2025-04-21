import express from "express";
import {
    getAllSectionItems,
    getSectionItemById,
    createSectionItem,
    updateSectionItem,
    deleteSectionItem
} from "@app/controllers/portofoliocontroller";

const router = express.Router();

// Sections
const sections = ['projects', 'experience', 'education', 'certifications', 'references'];

sections.forEach(section => {
    router.get(`/${section}`, getAllSectionItems(section));
    router.get(`/${section}/:id`, getSectionItemById(section));
    router.post(`/${section}`, createSectionItem(section));
    router.put(`/${section}/:id`, updateSectionItem(section));
    router.delete(`/${section}/:id`, deleteSectionItem(section));
});

export default router;
