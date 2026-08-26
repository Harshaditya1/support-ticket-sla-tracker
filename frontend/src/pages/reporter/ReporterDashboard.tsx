import { useQuery } from "@apollo/client/react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { GET_TICKETS } from "../../graphql/queries/ticket";
import type { TicketsResponse } from "../../types/ticket";

export default function ReporterDashboard() {
  const { data, loading, error } = useQuery<TicketsResponse>(
    GET_TICKETS,
    {
      variables: { take: 10 },
    }
  );

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading tickets...</h2>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <h2 style={{ color: "red" }}>Error loading tickets</h2>
        <pre>{error.message}</pre>
      </DashboardLayout>
    );
  }

  const tickets = data?.tickets.edges ?? [];

  const openCount = tickets.filter(
    (t) => t.node.status === "OPEN"
  ).length;

  const progressCount = tickets.filter(
    (t) => t.node.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = tickets.filter(
    (t) => t.node.status === "RESOLVED"
  ).length;

  const breachedCount = tickets.filter(
    (t) => t.node.slaState === "BREACHED"
  ).length;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "34px" }}>
          Reporter Dashboard
        </h1>

        <p style={{ color: "#64748b" }}>
          Welcome! Here's an overview of your support tickets.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Open Tickets</h4>
          <h2 style={{ color: "#2563eb" }}>
            {openCount}
          </h2>
        </div>

        <div className="stat-card">
          <h4>In Progress</h4>
          <h2 style={{ color: "#ea580c" }}>
            {progressCount}
          </h2>
        </div>

        <div className="stat-card">
          <h4>Resolved</h4>
          <h2 style={{ color: "#16a34a" }}>
            {resolvedCount}
          </h2>
        </div>

        <div className="stat-card">
          <h4>SLA Breached</h4>
          <h2 style={{ color: "#dc2626" }}>
            {breachedCount}
          </h2>
        </div>
      </div>

      {/* Ticket Section */}
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "18px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Recent Tickets
        </h2>

        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map(({ node }) => (
            <div
              key={node.id}
              style={{
                borderBottom: "1px solid #e2e8f0",
                padding: "18px 0",
              }}
            >
              <h3>{node.title}</h3>

              <p
                style={{
                  color: "#64748b",
                  margin: "8px 0",
                }}
              >
                {node.description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}
                >
                  {node.priority}
                </span>

                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}
                >
                  {node.status}
                </span>

                <span
                  style={{
                    background:
                      node.slaState === "BREACHED"
                        ? "#fee2e2"
                        : node.slaState === "AT_RISK"
                        ? "#fef9c3"
                        : "#dcfce7",

                    color:
                      node.slaState === "BREACHED"
                        ? "#b91c1c"
                        : node.slaState === "AT_RISK"
                        ? "#a16207"
                        : "#15803d",

                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: 600,
                  }}
                >
                  {node.slaState}
                </span>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  color: "#475569",
                }}
              >
                Remaining SLA:{" "}
                <strong>{node.remainingMinutes} mins</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}