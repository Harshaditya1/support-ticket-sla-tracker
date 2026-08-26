import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import { GET_TICKETS } from "../../graphql/queries/ticket";
import { useAuth } from "../../hooks/useAuth";
import type { TicketsResponse } from "../../types/ticket";

export default function ReporterDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data, loading, error } = useQuery<TicketsResponse>(
    GET_TICKETS,
    {
      variables: {
        take: 10,
      },
    }
  );

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Loading tickets...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 30 }}>
        <h2 style={{ color: "red" }}>Error loading tickets</h2>

        <pre
          style={{
            background: "#f3f4f6",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "16px",
            whiteSpace: "pre-wrap",
          }}
        >
          {error.message}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "5px" }}>Reporter Dashboard</h1>
          <p style={{ color: "#64748b" }}>
            Total Tickets: {data?.tickets.edges.length ?? 0}
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          style={{
            padding: "10px 18px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Ticket List */}
      {data?.tickets.edges.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3>No Tickets Found</h3>
        </div>
      ) : (
        data?.tickets.edges.map(({ node }) => (
          <div
            key={node.id}
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{node.title}</h3>

            <p style={{ color: "#475569", marginBottom: "14px" }}>
              {node.description}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
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
                  fontSize: "13px",
                  fontWeight: "600",
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
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                SLA: {node.slaState}
              </span>
            </div>

            <hr style={{ border: "1px solid #e2e8f0", margin: "16px 0" }} />

            <p>
              <strong>Remaining Minutes:</strong> {node.remainingMinutes}
            </p>

            <p>
              <strong>First Response Deadline:</strong>{" "}
              {new Date(node.firstResponseDeadline).toLocaleString()}
            </p>

            <p>
              <strong>Resolution Deadline:</strong>{" "}
              {new Date(node.resolutionDeadline).toLocaleString()}
            </p>

            <p>
              <strong>Created At:</strong>{" "}
              {new Date(node.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}