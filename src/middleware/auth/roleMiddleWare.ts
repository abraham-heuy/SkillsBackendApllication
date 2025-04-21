import { Request, Response, NextFunction } from "express";
import { RoleRequest } from "@app/utils/types/userRoles"
import asyncHandler from "@app/middleware/asyncHandler";
//ensure user has required roles 
export const roleGuard = (allowedRoles: string[]) =>
    asyncHandler<void, RoleRequest>(async (req:RoleRequest, res:Response, next:NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role_name)) {
            res.status(403).json({ message: "Access denied: Insufficient permissions" });
            return;
        }
        next();
    });



// Specific guards
export const adminGuard = roleGuard(["admin"]);         // Full app control
export const librarianGuard = roleGuard(["recruiter"]); // Event creation & management
export const borrowerGuard = roleGuard(["candidate"]);   // Attendee-only actions
// Specific guard for Admin or Librarian  
export const adminOrRecruiterGuard= roleGuard(["admin", "recruiter"]);  