import { createContext } from "react";
import { AuthContextType, AuthState } from "../types";

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

export const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: () => {},
  logout: () => {},
  checkAuthStatus: async () => {},
});
