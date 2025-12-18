import { email, z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters"),

  email: z.email("Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),
  

});

export const loginSchema = z.object({
  email: z.email("Invalid Email format"),

  password: z.string().min(6, "Password must be at least 6 characters"),


});
