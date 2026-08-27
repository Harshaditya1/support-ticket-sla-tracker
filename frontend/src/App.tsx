import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import AgentDashboard from "./pages/agent/AgentDashboard";
import ReporterDashboard from "./pages/reporter/ReporterDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import TicketDetailsPage from "./pages/ticket/TicketDetailsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/agent"
        element={
          <ProtectedRoute role="AGENT">
            <AgentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reporter"
        element={
          <ProtectedRoute role="REPORTER">
            <ReporterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/ticket/:id"
  element={
    <ProtectedRoute>
      <TicketDetailsPage />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}