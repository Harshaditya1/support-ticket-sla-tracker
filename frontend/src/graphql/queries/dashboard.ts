import { gql } from "@apollo/client";

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      openTickets
      inProgressTickets
      resolvedTickets
      breachedTickets
      atRiskTickets

      ticketsByPriority {
        LOW
        MEDIUM
        HIGH
        URGENT
      }
    }
  }
`;