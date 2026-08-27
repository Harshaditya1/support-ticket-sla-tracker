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

export const CHANGE_TICKET_STATUS = gql`
  mutation ChangeTicketStatus($input: ChangeTicketStatusInput!) {
    changeTicketStatus(input: $input) {
      id
      status
      slaState
      remainingMinutes
      resolvedAt
    }
  }
`;