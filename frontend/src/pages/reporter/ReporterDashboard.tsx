import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Badge from "../../components/common/Badge";
import CreateTicketModal from "../../components/ticket/CreateTicketModal";

import { GET_TICKETS } from "../../graphql/queries/ticket";
import { useNavigate } from "react-router-dom";
import { GET_DASHBOARD_STATS } from "../../graphql/queries/dashboard";
import type { DashboardStatsResponse } from "../../types/dashboard";
import type {
  TicketsResponse,
  TicketsQueryVariables,
} from "../../types/ticket";

export default function ReporterDashboard() {
  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<
    "" | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  >("");

  const [priorityFilter, setPriorityFilter] = useState<
    "" | "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >("");

  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data, loading, error } = useQuery<TicketsResponse, TicketsQueryVariables>(
    GET_TICKETS,
    {
    variables: {
      take: 5,
      cursor,
      filter: {
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      },
    },
});

  const { data: statsData } = useQuery<DashboardStatsResponse>(GET_DASHBOARD_STATS);

  const stats = statsData?.dashboardStats;

  const tickets = useMemo(() => {
    const list = data?.tickets.edges ?? [];

    if (!search.trim()) return list;

    return list.filter((ticket) =>
      ticket.node.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

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

          <pre>{error.message}</pre>
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
              color: "#0F172A",
            }}
          >
            Reporter Dashboard
          </h1>

          <p
            style={{
              marginTop: "6px",
              color: "#64748B",
            }}
          >
            Track and manage your support tickets.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="create-btn"
        >
          + Create Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Open Tickets</h4>
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
          <h4>SLA Breached</h4>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
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
      

      {/* SLA Health */}      <div
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
              {(stats?.openTickets ?? 0) +
                (stats?.inProgressTickets ?? 0) -
                (stats?.atRiskTickets ?? 0) -
                (stats?.breachedTickets ?? 0)}
            </h2>
          </div>

          <div className="stat-card">
            <h4 style={{ color: "#CA8A04" }}>AT RISK</h4>
            <h2 style={{ color: "#CA8A04" }}>
              {stats?.atRiskTickets ?? 0}
            </h2>
          </div>

          <div className="stat-card">
            <h4 style={{ color: "#DC2626" }}>BREACHED</h4>
            <h2 style={{ color: "#DC2626" }}>
              {stats?.breachedTickets ?? 0}
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
      {/* Ticket Section */}
      <div className="ticket-table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Recent Tickets</h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              className="search-input"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
            >
              <option value="">All Status</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as typeof priorityFilter)
              }
            >
              <option value="">All Priority</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>

            <button
              className="clear-filter-btn"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setPriorityFilter("");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#64748B",
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

                  <td>
                    {node.createdAt ? (
                      new Date(node.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    ) : (
                      "--"
                    )}

                    <div
                      style={{
                        color: "#64748B",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {node.createdAt ? (
                        new Date(node.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      ) : (
                        "--"
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            className="create-btn"
            disabled={!data?.tickets.pageInfo.hasNextPage}
            onClick={() =>
              setCursor(
                data?.tickets.pageInfo.endCursor ??
                  undefined
              )
            }
          >
            Next Page →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          color: "#64748B",
          fontSize: "14px",
        }}
      >
        Showing{" "}
        <strong>{tickets.length}</strong> tickets.
      </div>

      {openModal && (
        <CreateTicketModal
          onClose={() => setOpenModal(false)}
        />
      )}
    </DashboardLayout>
    );
}