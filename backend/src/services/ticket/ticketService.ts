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