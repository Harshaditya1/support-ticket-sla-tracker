import { PrismaClient } from "@prisma/client";
import {
  addCommentSchema,
  AddCommentInput,
} from "../validation/commentValidation";

const prisma = new PrismaClient();

export async function addComment(
  input: AddCommentInput,
  authorId: string
) {
  const data = addCommentSchema.parse(input);

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: data.ticketId,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const comment = await prisma.comment.create({
    data: {
      ticketId: data.ticketId,
      authorId,
      content: data.content,
    },
  });

  // ⭐ First Response Logic
  if (
    ticket.firstResponseAt === null &&
    authorId !== ticket.reporterId
  ) {
    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        firstResponseAt: new Date(),
      },
    });
  }

  return comment;
}