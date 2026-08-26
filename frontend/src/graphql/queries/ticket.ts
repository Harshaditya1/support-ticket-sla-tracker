import { gql } from "@apollo/client";

export const GET_TICKETS = gql`
  query GetTickets($take: Int, $cursor: String) {
    tickets(take: $take, cursor: $cursor) {
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