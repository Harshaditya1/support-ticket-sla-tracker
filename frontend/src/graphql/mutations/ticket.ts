import { gql } from "@apollo/client";

export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      id
      title
      description
      priority
      status
      slaState
      remainingMinutes
      createdAt
    }
  }
`;