import { Prisma, PrismaClient, TicketStatus } from "@prisma/client";
import {
  createTicketSchema,
  CreateTicketInput,
} from "../../validation/ticketValidation";

const prisma = new PrismaClient();

export async function createTicket(
  input: CreateTicketInput,
  reporterId: string
) {
  const data = createTicketSchema.parse(input);

  const ticket = await prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: TicketStatus.OPEN,
      reporterId,
    },
  });

  return ticket;
}


type TicketFilters = {
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeId?: string;
};

export async function getTickets(filter?: TicketFilters) {
  const where: Prisma.TicketWhereInput = {};

  if (filter?.status) {
    where.status = filter.status;
  }

  if (filter?.priority) {
    where.priority = filter.priority;
  }

  if (filter?.assigneeId) {
    where.assigneeId = filter.assigneeId;
  }

  return prisma.ticket.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getTicketById(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
  });

  return ticket;
}
export async function assignTicket(
  ticketId: string,
  assigneeId: string
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const assignee = await prisma.user.findUnique({
    where: { id: assigneeId },
  });

  if (!assignee) {
    throw new Error("User not found");
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      assigneeId,
    },
  });
}