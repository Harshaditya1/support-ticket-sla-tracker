import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import { GET_COMMENTS } from "../../graphql/queries/comment";
import { ADD_COMMENT } from "../../graphql/mutations/comment";

import type {
  CommentsResponse,
  AddCommentResponse,
} from "../../types/comment";

type Props = {
  ticketId: string;
};

export default function CommentSection({
  ticketId,
}: Props) {
  const [comment, setComment] = useState("");

  const { data, loading } =
    useQuery<CommentsResponse>(GET_COMMENTS, {
      variables: { ticketId },
    });

  const [addComment, { loading: adding }] =
    useMutation<AddCommentResponse>(ADD_COMMENT, {
      refetchQueries: [
        {
          query: GET_COMMENTS,
          variables: { ticketId },
        },
      ],
    });

  async function handleAddComment() {
    if (!comment.trim()) return;

    try {
      await addComment({
        variables: {
          input: {
            ticketId,
            content: comment,
          },
        },
      });

      setComment("");
    } catch (err) {
      alert("Unable to add comment.");
      console.error(err);
    }
  }

  const comments = data?.comments ?? [];

  return (
    <div
      style={{
        marginTop: "36px",
        background: "white",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 8px 20px rgba(0,0,0,.05)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#0F172A",
        }}
      >
        Comments
      </h2>
            {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <div
          style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#F8FAFC",
            color: "#64748B",
          }}
        >
          No comments yet.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {comments.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <strong style={{ color: "#1E293B" }}>
                  User
                </strong>

                <span
                  style={{
                    color: "#64748B",
                    fontSize: "13px",
                  }}
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  color: "#334155",
                }}
              >
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <textarea
          rows={4}
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #CBD5E1",
            resize: "vertical",
            fontSize: "15px",
            outline: "none",
          }}
        />

        <button
          onClick={handleAddComment}
          disabled={adding}
          style={{
            alignSelf: "flex-end",
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 600,
            opacity: adding ? 0.7 : 1,
          }}
        >
          {adding ? "Posting..." : "Add Comment"}
        </button>
      </div>
    </div>
  );
}