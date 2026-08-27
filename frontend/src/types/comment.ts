export interface Comment {
  id: string;
  content: string;
  authorId: string;
  ticketId: string;
  createdAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface AddCommentResponse {
  addComment: Comment;
}