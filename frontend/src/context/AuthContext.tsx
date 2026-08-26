import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { jwtDecode } from "jwt-decode";

import type { User } from "../types/auth";
import { getToken, removeToken } from "../utils/storage";

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

type JwtPayload = {
  userId: string;
  role: "AGENT" | "REPORTER";
  exp: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  // Restore user from JWT when app loads
  useEffect(() => {
    const token = getToken();

    if (!token) return;

    try {
      const payload = jwtDecode<JwtPayload>(token);

      // Check token expiry
      if (payload.exp * 1000 < Date.now()) {
        removeToken();
        return;
      }

      setUser({
        id: payload.userId,
        role: payload.role,
        name: "",
        email: "",
      });
    } catch {
      removeToken();
    }
  }, []);

  function login(user: User) {
    setUser(user);
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider"
    );
  }

  return context;
}