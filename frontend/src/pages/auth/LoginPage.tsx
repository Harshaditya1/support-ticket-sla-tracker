import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="login-container">
      {/* Left Branding Panel */}
      <div className="login-left">
        <div className="brand-logo">
          🎧
        </div>

        <h2>Support Ticket Portal</h2>

        <h1>
          Manage.
          <br />
          Track.
          <br />
          <span>Resolve.</span>
        </h1>

        <p>
          A smart and efficient platform to manage support tickets,
          monitor SLA deadlines and improve customer support.
        </p>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-icon">🎟️</div>
            <div>
              <h4>Track Tickets</h4>
              <span>Monitor ticket status in real time.</span>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">⏰</div>
            <div>
              <h4>SLA Management</h4>
              <span>Stay ahead with SLA deadlines.</span>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div>
              <h4>Insights & Reports</h4>
              <span>Analyze performance and trends.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="login-right">
        <div className="login-card">
          <div className="avatar-circle">👤</div>

          <h2>Welcome Back</h2>

          <p>Login to your account to continue.</p>

          <LoginForm />

          <div className="divider">
            <span>Demo Accounts</span>
          </div>

          <div className="demo-accounts">
            <div className="demo-user">
              <strong>Agent</strong>
              <span>agent@example.com</span>
              <code>password123</code>
            </div>

            <div className="demo-user">
              <strong>Reporter</strong>
              <span>reporter@example.com</span>
              <code>password123</code>
            </div>
          </div>

          <small>© 2026 Support Ticket Portal</small>
        </div>
      </div>
    </div>
  );
}