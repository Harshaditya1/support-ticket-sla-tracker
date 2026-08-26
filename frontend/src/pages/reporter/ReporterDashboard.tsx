import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ReporterDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>Reporter Dashboard</h1>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}