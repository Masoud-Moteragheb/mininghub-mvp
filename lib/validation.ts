// lib/validation.ts
import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
  ownerEmail: z.string().email().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  summary: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
});
