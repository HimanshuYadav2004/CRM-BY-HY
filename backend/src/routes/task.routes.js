import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getTasks, createTask, toggleTaskStatus, deleteTask } from "../controllers/task.controller.js";

const router = express.Router();

router.use(authMiddleware); // Protect all routes

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id/toggle", toggleTaskStatus);
router.delete("/:id", deleteTask);

export default router;
