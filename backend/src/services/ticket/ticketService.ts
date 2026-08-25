import { PrismaClient, TicketStatus } from "@prisma/client";
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