import User from "../models/User.js";
import Lead from "../models/Lead.js";
import Task from "../models/Task.js";
import { createUserSchema } from "../validators/user.schema.js";
import generatePassword from "../utils/generatePassword.js";
import { ZodError } from "zod";

export const createUser = async (req, res) => {
  try {
    // 1. Validate request body
    const data = createUserSchema.parse(req.body);

    // 2. Only admin can create admin users
    if (data.role === "admin" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can create admin users",
      });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // 4. Generate temporary password
    const tempPassword = generatePassword();

    // 5. Create user
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: tempPassword, // will be hashed by mongoose pre-save hook
        role: data.role ?? "user",
      department: data.department,
      isActive: true,
    });

    // 6. Send response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
          role: user.role,
        department: user.department,
      },
      temporaryPassword: tempPassword, // send via email later
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.role === 'admin') {
          return res.status(400).json({ message: "Cannot deactivate admin" });
      }
  
      user.isActive = !user.isActive;
      await user.save();
  
      res.status(200).json({ message: "User status updated", user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

export const getAnalytics = async (req, res) => {
    try {
        // Leads Aggregation
        const totalLeads = await Lead.countDocuments();
        
        const leadsByStatus = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const leadsBySource = await Lead.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);

        // Tasks Aggregation
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        const completedTasks = await Task.countDocuments({ status: "completed" });

        res.status(200).json({
            totalLeads,
            leadsByStatus,
            leadsBySource,
            tasks: {
                total: totalTasks,
                pending: pendingTasks,
                completed: completedTasks
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching analytics" });
    }
};
