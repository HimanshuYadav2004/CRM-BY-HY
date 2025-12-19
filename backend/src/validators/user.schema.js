import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  role: z.enum(["admin", "manager", "user"]).default("user"),
  department: z.enum(["sales", "leads"]).optional(),
});


