import User from "../models/User.js";
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
