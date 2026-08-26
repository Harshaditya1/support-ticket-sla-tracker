export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type SlaState =
  | "ON_TRACK"
  | "AT_RISK"
  | "BREACHED";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  slaState: SlaState;
  remainingMinutes: number;
  firstResponseDeadline: string;
  resolutionDeadline: string;
  createdAt: string;
}

export interface TicketEdge {
  cursor: string;
  node: Ticket;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface TicketsResponse {
  tickets: {
    edges: TicketEdge[];
    pageInfo: PageInfo;
  };
}