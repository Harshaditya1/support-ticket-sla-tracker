import { useQuery } from "@apollo/client/react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Badge from "../../components/common/Badge";

import { GET_TICKETS } from "../../graphql/queries/ticket";
import type { TicketsResponse } from "../../types/ticket";
import { useState } from "react";
import CreateTicketModal from "../../components/ticket/CreateTicketModal";

export default function ReporterDashboard() {
     const [openModal, setOpenModal] = useState(false);
  const { data, loading, error } = useQuery<TicketsResponse>(
    GET_TICKETS,
    {
      variables: { take: 10 },
    }
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: "40px" }}>
          <h2>Loading tickets...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div style={{ padding: "40px" }}>
          <h2 style={{ color: "#dc2626" }}>
            Error loading tickets
          </h2>

          <pre style={{ whiteSpace: "pre-wrap" }}>
            {error.message}
          </pre>
        </div>
      </DashboardLayout>
    );
  }

  const tickets = data?.tickets.edges ?? [];

  const openCount = tickets.filter(
    (ticket) => ticket.node.status === "OPEN"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.node.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.node.status === "RESOLVED"
  ).length;

  const breachedCount = tickets.filter(
    (ticket) => ticket.node.slaState === "BREACHED"
  ).length;

  return (
    <DashboardLayout>
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              marginBottom: "6px",
            }}
          >
            Reporter Dashboard
          </h1>

          <p style={{ color: "#64748b" }}>
            Manage and track your support tickets with SLA monitoring.
          </p>
        </div>

        {/* Create Ticket Button (Next Milestone) */}

        <button
  onClick={() => setOpenModal(true)}
  style={{
    background:"#2563EB",
    color:"white",
    border:"none",
    borderRadius:"12px",
    padding:"12px 20px",
    cursor:"pointer",
    fontWeight:600,
  }}
>
  + Create Ticket
</button>
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
            {/* Ticket Table */}

      <div className="ticket-table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2>Recent Tickets</h2>

          <input
            placeholder="Search ticket..."
            style={{
              padding: "10px 14px",
              border: "1px solid #CBD5E1",
              borderRadius: "10px",
              width: "240px",
            }}
          />
        </div>

        {tickets.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No tickets found.
          </div>
        ) : (
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Priority</th>
                <th>Status</th>
                <th>SLA</th>
                <th>Remaining</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map(({ node }) => (
                <tr key={node.id}>
                  <td>
                    <div className="ticket-title">
                      {node.title}
                    </div>

                    <div className="ticket-desc">
                      {node.description}
                    </div>
                  </td>

                  <td>
                    <Badge
                      label={node.priority}
                      type="priority"
                    />
                  </td>

                  <td>
                    <Badge
                      label={node.status}
                      type="status"
                    />
                  </td>

                  <td>
                    <Badge
                      label={node.slaState}
                      type="sla"
                    />
                  </td>

                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          node.remainingMinutes <= 30
                            ? "#dc2626"
                            : "#2563eb",
                      }}
                    >
                      {node.remainingMinutes} mins
                    </span>
                  </td>

                  <td>
                    {new Date(node.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {new Date(node.createdAt).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}

      <div
        style={{
          marginTop: "28px",
          textAlign: "center",
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        Showing{" "}
        <strong>{tickets.length}</strong>{" "}
        tickets from GraphQL backend.
      </div>
      {openModal && (
  <CreateTicketModal
    onClose={() => setOpenModal(false)}
  />
)}
    </DashboardLayout>
  );
}