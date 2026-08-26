import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <nav className="navbar">
      <h2>Support Ticket Portal</h2>

      <div
        style={{
          display:"flex",
          alignItems:"center",
          gap:"18px",
        }}
      >
        <span style={{ color:"#475569" }}>
          {user?.role}
        </span>

        <button
          className="logout-btn"
          onClick={()=>{
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}