import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { createUser, getUsers, toggleUserStatus, getAnalytics } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, authorizeRoles('admin'), (req, res) => {
    res.status(200).json({
        message: 'Welcome Admin',
        admin: req.user.name
    });
});

router.post("/users", authMiddleware, authorizeRoles("admin"), createUser);
router.get("/users", authMiddleware, authorizeRoles("admin"), getUsers);
router.patch("/users/:id/toggle-status", authMiddleware, authorizeRoles("admin"), toggleUserStatus);
router.get("/analytics", authMiddleware, authorizeRoles("admin"), getAnalytics);

export default router;
//importing as adminRoutes in app.js