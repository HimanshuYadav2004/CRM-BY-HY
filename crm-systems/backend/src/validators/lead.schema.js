import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email().optional(),
  phone: z.string().optional(),
  source: z.enum(["website", "call", "email", "referral", "ads"]).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z
    .enum(["new", "contacted", "qualified", "converted", "lost"])
    .optional(),
});
