import { Request, Response } from "express";
import asyncHandler from "@app/middleware/asyncHandler";
import pool from "@app/db/db";
 
//filter candidates based on different criteria:
export const filterCandidates = asyncHandler(async (req: Request, res: Response) => {
  const { title, location } = req.query;

  const titleFilter = title
    ? `%${(title as string).toLowerCase().replace(/\s+/g, '')}%`
    : '%';
  const locationFilter = location
    ? `%${(location as string).toLowerCase().replace(/\s+/g, '')}%`
    : '%';

  const result = await pool.query(
    `
    SELECT DISTINCT u.id, u.name, u.email, pd.title, pd.description, pd.location
    FROM users u
    JOIN portfolio_data pd ON pd.user_id = u.id
    WHERE u.role_id = (SELECT id FROM roles WHERE role_name = 'candidate')
      AND LOWER(REPLACE(pd.title, ' ', '')) LIKE $1
      AND LOWER(REPLACE(pd.location, ' ', '')) LIKE $2
    `,
    [titleFilter, locationFilter]
  );

  res.status(200).json({ candidates: result.rows });
});




  // Filter jobs by title and location
  export const filterJobs = asyncHandler(async (req: Request, res: Response) => {
    const { title = "", location = "" } = req.query;
    const filters: string[] = [];
    const values: string[] = [];
  
    if (title) {
      filters.push("LOWER(REPLACE(title, ' ', '')) LIKE $" + (filters.length + 1));
      values.push(`%${(title as string).toLowerCase().replace(/\s/g, "")}%`);
    }
  
    if (location) {
      filters.push("LOWER(REPLACE(location, ' ', '')) LIKE $" + (filters.length + 1));
      values.push(`%${(location as string).toLowerCase().replace(/\s/g, "")}%`);
    }
  
    const query = `
      SELECT * FROM jobs
      ${filters.length ? "WHERE " + filters.join(" AND ") : ""}
      ORDER BY created_at DESC
    `;
  
    const result = await pool.query(query, values);
    res.status(200).json({ jobs: result.rows });
  });
  