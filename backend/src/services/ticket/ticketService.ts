import {
  PrismaClient,
  TicketStatus,
  Prisma,
  Priority,
} from "@prisma/client";
import { differenceInMinutes } from "date-fns";

import {
  createTicketSchema,
  CreateTicketInput,
} from "../../validation/ticketValidation";

import {
  calculateSlaDeadline,
  getSlaState,
} from "../sla/slaCalculator";

const prisma = new PrismaClient();

async function enrichTicketWithSla(ticket: any) {
  const holidays = await prisma.holiday.findMany({
    select: { date: true },
  });

  const holidayDates = holidays.map((h) => h.date);

  const firstResponseDeadline = calculateSlaDeadline(
    ticket.createdAt,
    ticket.priority as Priority,
    "FIRST_RESPONSE",
    holidayDates
  );

  const resolutionDeadline = calculateSlaDeadline(
    ticket.createdAt,
    ticket.priority as Priority,
    "RESOLUTION",
    holidayDates
  );

  const deadline =
    ticket.status === TicketStatus.RESOLVED ||
    ticket.status === TicketStatus.CLOSED
      ? resolutionDeadline
      : firstResponseDeadline;

  const totalMinutes =
    ticket.status === TicketStatus.RESOLVED ||
    ticket.status === TicketStatus.CLOSED
      ? {
          URGENT: 240,
          HIGH: 1440,
          MEDIUM: 2880,
          LOW: 4320,
        }[ticket.priority as Priority]
      : {
          URGENT: 60,
          HIGH: 240,
          MEDIUM: 480,
          LOW: 1440,
        }[ticket.priority as Priority];

  const remainingMinutes = Math.max(
    differenceInMinutes(deadline, new Date()),
    0
  );

  return {
  ...ticket,

  // Dates ko string me convert karke frontend bhejo
  createdAt: ticket.createdAt.toISOString(),
  firstResponseAt: ticket.firstResponseAt?.toISOString() ?? null,
  resolvedAt: ticket.resolvedAt?.toISOString() ?? null,

  firstResponseDeadline: firstResponseDeadline.toISOString(),
  resolutionDeadline: resolutionDeadline.toISOString(),

  slaState: getSlaState(deadline, totalMinutes, new Date()),
  remainingMinutes,
};
}

// ---------------- CREATE TICKET ----------------

export async function createTicket(
  input: CreateTicketInput,
  reporterId: string
) {
  const data = createTicketSchema.parse(input);
  const firstResponseDeadline = new Date(
  Date.now() + 60 * 60 * 1000 // 1 hour
);

const resolutionDeadline = new Date(
  Date.now() + 24 * 60 * 60 * 1000 // 24 hours
);

  return prisma.ticket.create({
  data: {
  title: input.title,
  description: input.description,
  priority: input.priority ?? Priority.LOW,

  reporterId,

  status: TicketStatus.OPEN,
  slaState: "ON_TRACK",

  firstResponseDeadline,
  resolutionDeadline,
},
});
}

// ---------------- GET TICKETS ----------------

type TicketFilters = {
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeId?: string;
};
type TicketPaginationArgs = {
  filter?: TicketFilters;
  cursor?: string;
  take?: number;
};

export async function getTickets({
  filter,
  cursor,
  take = 10,
}: TicketPaginationArgs) {
  const where: Prisma.TicketWhereInput = {};

  if (filter?.status) where.status = filter.status;
  if (filter?.priority) where.priority = filter.priority;
  if (filter?.assigneeId) where.assigneeId = filter.assigneeId;

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      reporter: true,
      assignee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: take + 1, // fetch one extra record
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  const hasNextPage = tickets.length > take;

  const paginatedTickets = hasNextPage
    ? tickets.slice(0, take)
    : tickets;

  const edges = await Promise.all(
    paginatedTickets.map(async (ticket) => ({
      cursor: ticket.id,
      node: await enrichTicketWithSla(ticket),
    }))
  );

  return {
    edges,
    pageInfo: {
      endCursor:
        edges.length > 0
          ? edges[edges.length - 1].cursor
          : null,
      hasNextPage,
    },
  };
}

// ---------------- GET SINGLE TICKET ----------------

export async function getTicketById(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      reporter: true,
      assignee: true,
      comments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    return null;
  }

  return enrichTicketWithSla(ticket);
}

// ---------------- ASSIGN TICKET ----------------

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

// ---------------- CHANGE STATUS ----------------

export async function changeTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const validTransitions: Record<TicketStatus, TicketStatus[]> = {
    OPEN: [TicketStatus.IN_PROGRESS],
    IN_PROGRESS: [TicketStatus.RESOLVED],
    RESOLVED: [TicketStatus.CLOSED],
    CLOSED: [],
  };

  if (!validTransitions[ticket.status].includes(status)) {
    throw new Error("Invalid status transition");
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status,

      // Resolve time save karo
      resolvedAt:
        status === TicketStatus.RESOLVED
          ? new Date()
          : ticket.resolvedAt,
    },
  });

  // SLA ko deadline ke basis par dobara calculate karke return karo
  return enrichTicketWithSla(updatedTicket);
}