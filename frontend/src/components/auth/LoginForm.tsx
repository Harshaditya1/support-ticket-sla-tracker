import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";

import { LOGIN_MUTATION } from "../../graphql/mutations/auth";
import { saveToken } from "../../utils/storage";
import { useAuth } from "../../hooks/useAuth";

import type {
  LoginResponse,
  LoginVariables,
} from "../../types/auth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginMutation, { loading, error }] =
    useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      const { data } = await loginMutation({
        variables: {
          input: { email, password },
        },
      });

      if (!data) return;

      saveToken(data.login.token);
      login(data.login.user);

      if (data.login.user.role === "AGENT") {
        navigate("/agent");
      } else {
        navigate("/reporter");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label>Email Address</label>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="login-options">
        <label className="remember">
          <input type="checkbox" />
          Remember me
        </label>

        <button
          type="button"
          className="forgot-btn"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        className="login-btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && (
        <p className="error">
          Invalid email or password.
        </p>
      )}
    </form>
  );
}