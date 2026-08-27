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

  reporterId: string;
  assigneeId?: string | null;

  createdAt: string;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;

  firstResponseDeadline?: string | null;
  resolutionDeadline?: string | null;
}
export interface TicketResponse {
  ticket: Ticket;
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
export interface TicketFilter {
  status?: TicketStatus;
  priority?: Priority;
  assigneeId?: string;
  slaState?: string;
}

export interface TicketsQueryVariables {
  filter?: TicketFilter;
  take?: number;
  cursor?: string;
}