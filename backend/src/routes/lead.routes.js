import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller.js";

const router = express.Router();

// CREATE lead 
router.post("/", authMiddleware, authorizeRoles("admin", "user", "manager"), createLead);

// READ all leads 
router.get("/", authMiddleware, authorizeRoles("admin", "user", "manager"), getLeads);

// READ single lead
router.get("/:id", authMiddleware, authorizeRoles("admin", "user", "manager"), getLeadById);

// UPDATE 
router.put("/:id", authMiddleware, authorizeRoles("admin", "user", "manager"), updateLead);

// DELETE (Admin only for now?) Let's keep delete admin only
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteLead);

export default router;
