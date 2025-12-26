import express from "express";

import { login, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.put("/profile", authMiddleware, updateProfile);

export default router;
