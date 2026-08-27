import { gql } from "@apollo/client";

/* ---------------- GET ALL TICKETS ---------------- */

export const GET_TICKETS = gql`
  query GetTickets(
    $filter: TicketFilterInput
    $take: Int
    $cursor: String
  ) {
    tickets(
      filter: $filter
      take: $take
      cursor: $cursor
    ) {
      edges {
        cursor
        node {
          id
          title
          description
          priority
          status
          slaState
          remainingMinutes
          firstResponseDeadline
          resolutionDeadline
          createdAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

/* ---------------- GET SINGLE TICKET ---------------- */

export const GET_TICKET = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      id
      title
      description
      priority
      status
      slaState
      remainingMinutes

      reporterId
      assigneeId

      createdAt
      firstResponseAt
      resolvedAt

      firstResponseDeadline
      resolutionDeadline
    }
  }
`;