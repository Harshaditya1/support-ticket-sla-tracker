export type Role = "REPORTER" | "AGENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

export interface LoginVariables {
  input: {
    email: string;
    password: string;
  };
}