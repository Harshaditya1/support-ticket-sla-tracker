import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      id
      content
      createdAt
    }
  }
`;