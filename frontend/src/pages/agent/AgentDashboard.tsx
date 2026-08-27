import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Badge from "../../components/common/Badge";

import { GET_TICKETS } from "../../graphql/queries/ticket";
import { CHANGE_TICKET_STATUS } from "../../graphql/mutations/ticket";
import { useNavigate } from "react-router-dom";
import { GET_DASHBOARD_STATS } from "../../graphql/queries/dashboard";
import type { DashboardStatsResponse } from "../../types/dashboard";
import type {
  TicketsResponse,
  TicketsQueryVariables,
  TicketStatus,
} from "../../types/ticket";

export default function AgentDashboard() {
  const [statusFilter, setStatusFilter] = useState<
    "" | "OPEN" | "IN_PROGRESS" | "RESOLVED"
  >("");
const navigate = useNavigate();
  const { data, loading, error } = useQuery<
    TicketsResponse,
    TicketsQueryVariables
  >(GET_TICKETS, {
    variables: {
      take: 10,
      filter: {
        status: statusFilter || undefined,
      },
    },
  });
  const { data: statsData } =
  useQuery<DashboardStatsResponse>(
    GET_DASHBOARD_STATS
  );

const stats = statsData?.dashboardStats;

  const [changeStatus, { loading: updating }] =
    useMutation(CHANGE_TICKET_STATUS, {
      refetchQueries: [
        {
          query: GET_TICKETS,
          variables: { take: 10 },
        },
      ],
      awaitRefetchQueries: true,
    });

  const tickets = useMemo(
    () => data?.tickets.edges ?? [],
    [data]
  );

  async function updateTicketStatus(
    ticketId: string,
    status: TicketStatus
  ) {
    try {
      await changeStatus({
        variables: {
          input: {
            ticketId,
            status,
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert("Unable to update ticket status.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: "40px" }}>
          Loading tickets...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div style={{ padding: "40px" }}>
          <h2 style={{ color: "red" }}>
            Failed to load tickets
          </h2>

          <p>{error.message}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
              {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Agent Dashboard
          </h1>

          <p style={{ color: "#64748B" }}>
            Manage assigned tickets and update SLA status.
          </p>
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as typeof statusFilter
            )
          }
        >
          <option value="">All Tickets</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">
            IN PROGRESS
          </option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {/* KPI Cards */}

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Open</h4>

          <h2 style={{ color: "#2563EB" }}>
            {stats?.openTickets ?? 0}
          </h2>
        </div>

        <div className="stat-card">
          <h4>In Progress</h4>

          <h2 style={{ color: "#EA580C" }}>
            {stats?.inProgressTickets ?? 0}
          </h2>
        </div>

        <div className="stat-card">
          <h4>Resolved</h4>

          <h2 style={{ color: "#16A34A" }}>
            {stats?.resolvedTickets ?? 0}
          </h2>
        </div>

        <div className="stat-card">
          <h4>Breached SLA</h4>

          <h2 style={{ color: "#DC2626" }}>
            {stats?.breachedTickets ?? 0}
          </h2>
        </div>
      </div>
      {/* Priority Distribution */}

<div
  style={{
    marginBottom: "30px",
    background: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,.05)",
  }}
>
  <h2
    style={{
      marginBottom: "20px",
      color: "#0F172A",
    }}
  >
    Priority Distribution
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(160px,1fr))",
      gap: "16px",
    }}
  >
    <div className="stat-card">
      <h4 style={{ color: "#16A34A" }}>LOW</h4>
      <h2>{stats?.ticketsByPriority.LOW ?? 0}</h2>
    </div>

    <div className="stat-card">
      <h4 style={{ color: "#CA8A04" }}>MEDIUM</h4>
      <h2>{stats?.ticketsByPriority.MEDIUM ?? 0}</h2>
    </div>

    <div className="stat-card">
      <h4 style={{ color: "#EA580C" }}>HIGH</h4>
      <h2>{stats?.ticketsByPriority.HIGH ?? 0}</h2>
    </div>

    <div className="stat-card">
      <h4 style={{ color: "#DC2626" }}>URGENT</h4>
      <h2>{stats?.ticketsByPriority.URGENT ?? 0}</h2>
    </div>
  </div>
</div>

{/* SLA Health */}

<div
  style={{
    marginBottom: "30px",
    background: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,.05)",
  }}
>
  <h2
    style={{
      marginBottom: "20px",
      color: "#0F172A",
    }}
  >
    SLA Health
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
      gap: "16px",
    }}
  >
    <div className="stat-card">
      <h4 style={{ color: "#16A34A" }}>ON TRACK</h4>
      <h2 style={{ color: "#16A34A" }}>
  {tickets.filter((t) => t.node.slaState === "ON_TRACK").length}
</h2>
    </div>

    <div className="stat-card">
      <h4 style={{ color: "#CA8A04" }}>AT RISK</h4>
      <h2 style={{ color: "#CA8A04" }}>
  {tickets.filter((t) => t.node.slaState === "AT_RISK").length}
</h2>
    </div>

    <div className="stat-card">
      <h4 style={{ color: "#DC2626" }}>BREACHED</h4>
      <h2 style={{ color: "#DC2626" }}>
  {tickets.filter((t) => t.node.slaState === "BREACHED").length}
</h2>
    </div>
  </div>
</div>

{/* Recent Activity */}

<div
  style={{
    marginBottom: "30px",
    background: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,.05)",
  }}
>
  <h2
    style={{
      marginBottom: "20px",
      color: "#0F172A",
    }}
  >
    Recent Activity
  </h2>

  {tickets.slice(0, 5).map(({ node }) => (
    <div
      key={node.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 600,
            color: "#1E293B",
          }}
        >
          {node.title}
        </div>

        <div
          style={{
            color: "#64748B",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          Status changed to {node.status}
        </div>
      </div>

      <Badge label={node.status} type="status" />
    </div>
  ))}

  {tickets.length === 0 && (
    <p style={{ color: "#64748B" }}>
      No recent activity found.
    </p>
  )}
</div>

      {/* Ticket Table */}

      <div className="ticket-table-container">
        <h2 style={{ marginBottom: "20px" }}>
          Assigned Tickets
        </h2>

        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Priority</th>
              <th>Status</th>
              <th>SLA</th>
              <th>Remaining</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
                        {tickets.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748B",
                  }}
                >
                  No assigned tickets found.
                </td>
              </tr>
            ) : (
              tickets.map(({ node }) => (
                <tr
  key={node.id}
  onClick={() => navigate(`/ticket/${node.id}`)}
  style={{
    cursor: "pointer",
    transition: "background 0.2s ease",
  }}
>
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
  node.slaState === "BREACHED"
    ? "#DC2626"
    : node.slaState === "AT_RISK"
    ? "#CA8A04"
    : "#16A34A",
                      }}
                    >
                      {(() => {
  const days = Math.floor(node.remainingMinutes / 1440);
  const hours = Math.floor((node.remainingMinutes % 1440) / 60);
  const minutes = node.remainingMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
})()}
                    </span>
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
  <select
    className="filter-select"
    value={node.status}
    disabled={updating}
    onClick={(e) => e.stopPropagation()}
    onChange={(e) =>
      updateTicketStatus(
        node.id,
        e.target.value as TicketStatus
      )
    }
  >
    <option value="OPEN">OPEN</option>
    <option value="IN_PROGRESS">IN_PROGRESS</option>
    <option value="RESOLVED">RESOLVED</option>
    <option value="CLOSED">CLOSED</option>
  </select>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}

        <div
          style={{
            marginTop: "20px",
            textAlign: "right",
            color: "#64748B",
            fontSize: "14px",
          }}
        >
          Showing{" "}
          <strong>{tickets.length}</strong>{" "}
          assigned tickets.
        </div>
      </div>
    </DashboardLayout>
  );
}
          
    