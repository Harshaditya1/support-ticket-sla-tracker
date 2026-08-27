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
    include: {
      author: true, // ✅ author + createdAt dono response me
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
    include: {
      author: true, // ✅ newly added comment me bhi author aur createdAt milega
    },
  });
}