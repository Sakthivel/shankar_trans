import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  userId: z.string().min(3, "User ID must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["STAFF", "MANAGER", "OWNER"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["STAFF", "MANAGER", "OWNER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  password: z.string().min(6).optional(),
});
