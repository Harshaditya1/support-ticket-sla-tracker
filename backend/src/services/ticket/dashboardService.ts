import { PrismaClient, Priority, TicketStatus } from "@prisma/client";
import { calculateSlaDeadline, getSlaState } from "../sla/slaCalculator";

const prisma = new PrismaClient();

export async function getDashboardStats() {
  const holidays = await prisma.holiday.findMany({
    select: { date: true },
  });

  const holidayDates = holidays.map((holiday) => holiday.date);

  const tickets = await prisma.ticket.findMany({
    select: {
      createdAt: true,
      priority: true,
      status: true,
    },
  });

  let breachedTickets = 0;
  let atRiskTickets = 0;

  for (const ticket of tickets) {
    const deadline = calculateSlaDeadline(
      ticket.createdAt,
      ticket.priority as Priority,
      ticket.status === TicketStatus.RESOLVED ||
        ticket.status === TicketStatus.CLOSED
        ? "RESOLUTION"
        : "FIRST_RESPONSE",
      holidayDates
    );

    const totalMinutes =
      ticket.status === TicketStatus.RESOLVED ||
      ticket.status === TicketStatus.CLOSED
        ? {
            URGENT: 240,
            HIGH: 1440,
            MEDIUM: 2880,
            LOW: 4320,
          }[ticket.priority]
        : {
            URGENT: 60,
            HIGH: 240,
            MEDIUM: 480,
            LOW: 1440,
          }[ticket.priority];

    const slaState = getSlaState(deadline, totalMinutes, new Date());

    if (slaState === "BREACHED") breachedTickets++;
    if (slaState === "AT_RISK") atRiskTickets++;
  }

  const [
    openTickets,
    inProgressTickets,
    resolvedTickets,
    lowCount,
    mediumCount,
    highCount,
    urgentCount,
  ] = await Promise.all([
    prisma.ticket.count({ where: { status: TicketStatus.OPEN } }),
    prisma.ticket.count({ where: { status: TicketStatus.IN_PROGRESS } }),
    prisma.ticket.count({ where: { status: TicketStatus.RESOLVED } }),
    prisma.ticket.count({ where: { priority: Priority.LOW } }),
    prisma.ticket.count({ where: { priority: Priority.MEDIUM } }),
    prisma.ticket.count({ where: { priority: Priority.HIGH } }),
    prisma.ticket.count({ where: { priority: Priority.URGENT } }),
  ]);

  return {
    openTickets,
    inProgressTickets,
    resolvedTickets,
    breachedTickets,
    atRiskTickets,
    ticketsByPriority: {
      LOW: lowCount,
      MEDIUM: mediumCount,
      HIGH: highCount,
      URGENT: urgentCount,
    },
  };
}