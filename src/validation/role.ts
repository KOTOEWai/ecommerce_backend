import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, { message: "Role name must be at least 2 characters" }),
});

export const updateRoleSchema = z.object({
  name: z.string().trim().min(2, { message: "Role name must be at least 2 characters" }).optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
