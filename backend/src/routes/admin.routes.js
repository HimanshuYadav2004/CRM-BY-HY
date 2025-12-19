import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { createUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, authorizeRoles('admin'), (req, res) => {
    res.status(200).json({
        message: 'Welcome Admin',
        admin: req.user.name
    });
});

router.post("/users", authMiddleware, authorizeRoles("admin"), createUser);


export default router
//importing as adminRoutes in app.js