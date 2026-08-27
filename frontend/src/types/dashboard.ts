export interface PriorityStats {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  URGENT: number;
}

export interface DashboardStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  breachedTickets: number;
  atRiskTickets: number;

  ticketsByPriority: PriorityStats;
}

export interface DashboardStatsResponse {
  dashboardStats: DashboardStats;
}