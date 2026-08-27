import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Badge from "../../components/common/Badge";

import { GET_TICKET } from "../../graphql/queries/ticket";
import type { TicketResponse } from "../../types/ticket";
import CommentSection from "../../components/ticket/CommentSection";

export default function TicketDetailsPage() {
  const { id } = useParams();

  const { data, loading, error } = useQuery<TicketResponse>(
    GET_TICKET,
    {
      variables: { id },
      skip: !id,
    }
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: "40px" }}>
          <h2>Loading ticket...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data?.ticket) {
    return (
      <DashboardLayout>
        <div style={{ padding: "40px" }}>
          <h2 style={{ color: "#DC2626" }}>
            Ticket not found
          </h2>

          <p>{error?.message}</p>
        </div>
      </DashboardLayout>
    );
  }

  const ticket = data.ticket;

  return (
    <DashboardLayout>
      {/* Header */}

      <div
        style={{
          marginBottom: "28px",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            marginBottom: "8px",
            color: "#0F172A",
          }}
        >
          Ticket Details
        </h1>

        <p style={{ color: "#64748B" }}>
          Complete information and SLA timeline.
        </p>
      </div>

      {/* Ticket Card */}

      <div
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "18px",
          boxShadow: "0 8px 20px rgba(0,0,0,.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#1E293B",
              }}
            >
              {ticket.title}
            </h2>

            <p
              style={{
                color: "#64748B",
                marginTop: "12px",
                lineHeight: 1.6,
              }}
            >
              {ticket.description}
            </p>
          </div>

          <Badge
            label={ticket.priority}
            type="priority"
          />
        </div>

        <hr
          style={{
            margin: "24px 0",
            border: "none",
            borderTop: "1px solid #E2E8F0",
          }}
        />
                {/* Status Section */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          <div className="stat-card">
            <h4>Status</h4>

            <Badge
              label={ticket.status}
              type="status"
            />
          </div>

          <div className="stat-card">
            <h4>SLA State</h4>

            <Badge
              label={ticket.slaState}
              type="sla"
            />
          </div>

          <div className="stat-card">
            <h4>Remaining SLA</h4>

            <h2
              style={{
                color:
                  ticket.remainingMinutes <= 30
                    ? "#DC2626"
                    : "#2563EB",
              }}
            >
              {ticket.remainingMinutes} mins
            </h2>
          </div>

          <div className="stat-card">
            <h4>Created</h4>

            <p>
              {new Date(
                ticket.createdAt
              ).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* SLA Timeline */}

        <h3
          style={{
            marginBottom: "18px",
            color: "#1E293B",
          }}
        >
          SLA Timeline
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "#EFF6FF",
            }}
          >
            <strong>
              First Response Deadline
            </strong>

            <p style={{ marginTop: "6px" }}>
              {ticket.firstResponseDeadline
                ? new Date(
                    ticket.firstResponseDeadline
                  ).toLocaleString("en-IN")
                : "Not Available"}
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "#FEFCE8",
            }}
          >
            <strong>Resolution Deadline</strong>

            <p style={{ marginTop: "6px" }}>
              {ticket.resolutionDeadline
                ? new Date(
                    ticket.resolutionDeadline
                  ).toLocaleString("en-IN")
                : "Not Available"}
            </p>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "#ECFDF5",
            }}
          >
            <strong>Resolved At</strong>

            <p style={{ marginTop: "6px" }}>
              {ticket.resolvedAt
                ? new Date(
                    ticket.resolvedAt
                  ).toLocaleString("en-IN")
                : "Ticket not resolved yet."}
            </p>
          </div>
        </div>

        {/* IDs */}

        <div
          style={{
            marginTop: "30px",
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          <p>
            <strong>Reporter ID:</strong>{" "}
            {ticket.reporterId}
          </p>

          <p>
            <strong>Assignee ID:</strong>{" "}
            {ticket.assigneeId ?? "Not Assigned"}
          </p>
        </div>
      </div>
      <CommentSection ticketId={ticket.id} />
    </DashboardLayout>
  );
}