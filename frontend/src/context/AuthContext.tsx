import {
  createContext,
  useContext,
  useMemo,
  useState,
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
  // Refresh ke time localStorage/JWT se user restore hoga
  const [user, setUser] = useState<User | null>(() => {
    const token = getToken();

    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayload>(token);

      // Token expire ho gaya ho to logout
      if (payload.exp * 1000 < Date.now()) {
        removeToken();
        return null;
      }

      return {
        id: payload.userId,
        role: payload.role,
        name: "",
        email: "",
      };
    } catch {
      removeToken();
      return null;
    }
  });

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