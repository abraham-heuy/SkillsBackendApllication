// Use UserRequest instead of Request.
// Ensure Admins manage users (using adminGuard in userRoutes.ts).
// Return only safe user details (excluding password).
// ✅ Ensures Admins can manage users (CRUD).
// ✅ Returns safe user details (excludes password).
// ✅ New users default to the Attendee role.
import { Request, Response } from "express";

import pool from "../db/db";
import asyncHandler from "../middleware/asyncHandler";

//Only admins should get all users
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query(`
        SELECT 
            users.id, 
            users.name, 
            users.email, 
            users.role_id, 
            portfolio_data.title, 
            portfolio_data.description, 
            portfolio_data.location
        FROM users
        LEFT JOIN portfolio_data ON users.id = portfolio_data.user_id
        ORDER BY users.id ASC
    `);
    res.status(200).json(result.rows);
})

//get user by id:
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT user_id, name, email, role_id FROM users WHERE user_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//update the user profile: 

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role_id } = req.body;

        if (!name && !email && !role_id) {
            return res.status(400).json({ message: "No update fields provided." });
        }

        const result = await pool.query(
            `UPDATE users SET 
        name = COALESCE($1, name), 
        email = COALESCE($2, email), 
        role_id = COALESCE($3, role_id) 
       WHERE user_id = $4 RETURNING user_id, name, email, role_id`,
            [name, email, role_id, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "User not found" });
            return
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//delete the user
export const deleteUsers = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(500).json({
                message: "No user Id found"
            })
        }
        const result = await pool.query("DELETE FROM users WHERE id = $1;", [id]);
        if (result.rowCount == 0) {
            res.status(500).json({
                message: "User Not Found😕😔"
            })
            return
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
})
