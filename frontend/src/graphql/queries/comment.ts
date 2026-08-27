import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($ticketId: ID!) {
    comments(ticketId: $ticketId) {
      id
      content
      ticketId
      authorId
      createdAt
    }
  }
`;