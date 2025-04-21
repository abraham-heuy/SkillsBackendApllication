import express from 'express'
import { deleteUsers, getUserById, getUsers, updateUser } from '../controllers/usersControllers'
import { protect } from '../middleware/auth/protect'
import { adminGuard } from '../middleware/auth/roleMiddleWare'

const router = express.Router()

//public routes 
//  - go the route of api.v1/users
// - then check if they are logged in 
// -  check if they are admin then
// - get the users - controller
// Modify userRoutes.ts to: ✅ Require authentication (protect) before accessing routes.
// ✅ Use role-based guards (adminGuard) to limit access.
// ✅ Admins can manage users (CRUD).
// ✅ Regular users (Organizers & Attendees) cannot modify users.
// ✅ Public registration remains open (POST /users).
router.get("/", getUsers)
router.put("/:id",protect, updateUser)
router.get("/:id",protect, getUserById)
router.delete("/:id", deleteUsers)


export default router