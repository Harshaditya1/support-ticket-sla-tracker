import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getComments(ticketId: string) {
  return prisma.comment.findMany({
    where: {
      ticketId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function addComment(
  ticketId: string,
  authorId: string,
  content: string
) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  return prisma.comment.create({
    data: {
      ticketId,
      authorId,
      content,
    },
  });
}