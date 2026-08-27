export interface Comment {
  id: string;
  content: string;
  createdAt: string;

  author: {
    id: string;
    name: string;
    role: "AGENT" | "REPORTER";
  };
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface AddCommentResponse {
  addComment: Comment;
}