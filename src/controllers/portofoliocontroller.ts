import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import pool from "@app/db/db";

// Generic function to get all items in a section
export const getAllSectionItems = (section: string) => asyncHandler(async (_req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM portfolio_data WHERE section = $1", [section]);
    res.status(200).json(result.rows);
});

// Get one item by ID
export const getSectionItemById = (section: string) => asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM portfolio_data WHERE id = $1 AND section = $2", [id, section]);
    
    if (result.rows.length === 0) {
        res.status(404).json({ message: `${section} not found` });
        return 
    }

    res.status(200).json(result.rows[0]);
});

// Create item
export const createSectionItem = (section: string) => asyncHandler(async (req: Request, res: Response) => {
    const { title, description, start_date, end_date, organization, location, user_id, reference_contact} = req.body;

    if (!user_id) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    const result = await pool.query(`
        INSERT INTO portfolio_data (user_id, section, title, description, start_date, end_date, organization, location,reference_contact)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `, [user_id, section, title, description, start_date, end_date, organization, location,reference_contact]);

    res.status(201).json(result.rows[0]);
});


// Update item
export const updateSectionItem = (section: string) => asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, organization, location } = req.body;

    const result = await pool.query(`
        UPDATE portfolio_data SET 
        title = $1, description = $2, start_date = $3, end_date = $4, 
        organization = $5, location = $6
        WHERE id = $7 AND section = $8
        RETURNING *
    `, [title, description, start_date, end_date, organization, location, id, section]);

    if (result.rows.length === 0) {
        res.status(404).json({ message: `${section} not found` });
        return 
    }

    res.status(200).json(result.rows[0]);
});

// Delete item
export const deleteSectionItem = (section: string) => asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM portfolio_data WHERE id = $1 AND section = $2 RETURNING *", [id, section]);

    if (result.rows.length === 0) {
        res.status(404).json({ message: `${section} not found` });
        return 
    }

    res.status(200).json({ message: `${section} deleted successfully` });
});
