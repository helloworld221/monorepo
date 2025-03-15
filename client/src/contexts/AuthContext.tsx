import React, { ReactNode, useEffect, useState } from "react";
import { checkCurrentUser, logoutUser } from "../services/auth";
import { AuthState } from "../types";
import { AuthContext } from "./AuthContext";

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  const checkAuthStatus = async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await checkCurrentUser();
      setAuthState({
        isAuthenticated: response.isAuthenticated,
        user: response.user,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: "Failed to check authentication status",
      });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = () => {
    window.location.href = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    }/auth/google`;
  };

  const logout = async () => {
    try {
      await logoutUser();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to logout",
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };

