import { z } from "zod";

export const addCommentSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),

  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type AddCommentInput = z.infer<typeof addCommentSchema>;