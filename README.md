# Support Ticket SLA Tracker

A production-style **full-stack ticket management platform** built with **React, GraphQL Yoga, Prisma, PostgreSQL, Apollo Client, and Bun**. The application enables support teams to manage tickets through a role-based workflow while automatically tracking **Service Level Agreement (SLA)** deadlines and ticket health.

This project demonstrates GraphQL API design, JWT authentication, Prisma ORM, business-hour SLA calculation, and a modern React frontend with Apollo Client.

---

## Overview

Support Ticket SLA Tracker provides two dedicated user experiences:

* **Reporter** — Creates and tracks support tickets.
* **Agent** — Manages assigned tickets, updates ticket status, and monitors SLA compliance.

The application enforces business rules on the backend and provides real-time SLA visibility through dashboards and ticket detail pages.

---

## Tech Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Frontend         | React 19, TypeScript, Vite |
| State Management | Apollo Client              |
| Backend          | GraphQL Yoga               |
| Runtime          | Bun                        |
| ORM              | Prisma                     |
| Database         | PostgreSQL                 |
| Authentication   | JWT                        |
| API              | GraphQL                    |

---

## Features

### Authentication & Authorization

* JWT-based authentication.
* Role-based access control (`REPORTER`, `AGENT`).
* Protected frontend routes.
* Persistent login after browser refresh.

### Ticket Management

* Create support tickets.
* Assign tickets to agents.
* Controlled ticket lifecycle.
* Status transition validation in backend service layer.

### SLA Engine

* Automatic first response deadline.
* Automatic resolution deadline.
* SLA health calculation.
* Remaining SLA countdown in days / hours / minutes.

### Dashboard

* Ticket statistics.
* SLA Health summary.
* Priority distribution.
* Search and filters.
* Cursor-based pagination.

### Ticket Details

* Complete ticket information.
* SLA timeline.
* Remaining SLA indicator.
* Reporter and assignee information.
* Comment timeline.

### Comments

* Add comments.
* View ticket discussion history.
* Timestamped comments.
* Automatic refresh after posting.

---

## Ticket Workflow

```text
OPEN
  │
  ▼
IN_PROGRESS
  │
  ▼
RESOLVED
  │
  ▼
CLOSED
```

**Valid transitions**

| From        | To          |
| ----------- | ----------- |
| OPEN        | IN_PROGRESS |
| IN_PROGRESS | RESOLVED    |
| RESOLVED    | CLOSED      |
| CLOSED      | Not Allowed |

The backend rejects invalid status transitions.

---

## SLA Policy

| Priority | First Response SLA | Resolution SLA |
| -------- | ------------------ | -------------- |
| URGENT   | 1 Hour             | 4 Hours        |
| HIGH     | 4 Hours            | 24 Hours       |
| MEDIUM   | 8 Hours            | 48 Hours       |
| LOW      | 24 Hours           | 72 Hours       |

SLA health is calculated as:

| State       | Meaning                                      |
| ----------- | -------------------------------------------- |
| 🟢 ON_TRACK | SLA is within safe threshold.                |
| 🟡 AT_RISK  | More than 75% of SLA time has been consumed. |
| 🔴 BREACHED | SLA deadline has been exceeded.              |

---

## UI Preview

### Login Page

![Login Page](./screenshots/login-page.png)

### Reporter Dashboard

![Reporter Dashboard](./screenshots/reporter-dashboard.png)

### Agent Dashboard

![Agent Dashboard](./screenshots/agent-dashboard.png)

### Create Ticket

![Create Ticket](./screenshots/create-ticket.png)

### Ticket Details

![Ticket Details](./screenshots/ticket-details.png)

---

## Project Structure

```text
support-ticket-sla-tracker
├── backend
│   ├── prisma
│   ├── src
│   │   ├── graphql
│   │   ├── services
│   │   ├── validation
│   │   ├── context.ts
│   │   └── server.ts
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── graphql
│   │   ├── hooks
│   │   ├── context
│   │   ├── layouts
│   │   ├── routes
│   │   └── types
│   └── package.json
│
├── screenshots
├── README.md
└── .gitignore
```

---

## Local Development

### Prerequisites

* Bun
* PostgreSQL
* Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd support-ticket-sla-tracker
```

### 2. Configure environment variables

Create `backend/.env`.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/support_ticket_db"
JWT_SECRET="your-secret-key"
PORT=4000
```

### 3. Backend

```bash
cd backend

bun install
bunx prisma migrate dev
bunx prisma generate
bun run src/server.ts
```

Backend API:

```text
http://localhost:4000/graphql
```

### 4. Frontend

Open a new terminal.

```bash
cd frontend

bun install
bun run dev
```

Frontend application:

```text
http://localhost:5173
```

---

## Demo Credentials

### Reporter

| Email                  | Password      |
| ---------------------- | ------------- |
| `reporter@example.com` | `password123` |

### Agent

| Email               | Password      |
| ------------------- | ------------- |
| `agent@example.com` | `password123` |

---

## GraphQL Operations

### Queries

* `tickets`
* `ticket`
* `comments`
* `dashboardStats`

### Mutations

* `login`
* `createTicket`
* `assignTicket`
* `changeTicketStatus`
* `addComment`

---

## Database Schema

Core entities implemented with Prisma:

| Model   | Purpose                             |
| ------- | ----------------------------------- |
| User    | Reporter and Agent accounts         |
| Ticket  | Ticket lifecycle and SLA metadata   |
| Comment | Ticket discussion history           |
| Holiday | Business-day aware SLA calculations |

Additional enums:

* `Role`
* `Priority`
* `TicketStatus`
* `SlaState`

---

## Assignment Coverage

* ✅ JWT Authentication
* ✅ Role-Based Authorization
* ✅ Ticket Creation
* ✅ Ticket Assignment
* ✅ Ticket Status Workflow
* ✅ SLA Deadline Calculation
* ✅ SLA Health Tracking
* ✅ Dashboard Statistics
* ✅ Search & Filters
* ✅ Pagination
* ✅ Ticket Details Page
* ✅ Comment System
* ✅ Protected Routes

---

## Future Enhancements

* GraphQL Subscriptions for live updates.
* Email notifications for SLA breaches.
* File attachments for tickets.
* Docker-based deployment.
* GitHub Actions CI pipeline.
* Kubernetes deployment.
* Monitoring with Prometheus & Grafana.

---

## Author

**Support Ticket SLA Tracker** — A full-stack GraphQL application demonstrating role-based authentication, SLA business logic, Prisma ORM, PostgreSQL, and Apollo Client.
