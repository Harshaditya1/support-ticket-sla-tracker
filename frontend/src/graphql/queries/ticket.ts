import { gql } from "@apollo/client";

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