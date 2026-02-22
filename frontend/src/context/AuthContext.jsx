import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi.js";
import { setAccessToken as setHttpAccessToken } from "../services/httpClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try refresh on initial load
    const tryRefresh = async () => {
      try {
        const { accessToken: token } = await authApi.refresh();
        setAccessToken(token);
        setHttpAccessToken(token); // Sync with httpClient
        // user payload is not in refresh, keep user from localStorage if available
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Refresh failed - clear auth state and redirect to login
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("user");
        // Only redirect if not already on login/register page
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, [navigate]);

  const login = async (email, password) => {
    const { user: u, accessToken: token } = await authApi.login({
      email,
      password,
    });
    setUser(u);
    setAccessToken(token);
    setHttpAccessToken(token); // Sync with httpClient
    localStorage.setItem("user", JSON.stringify(u));
    navigate("/");
  };

  const register = async (email, password) => {
    await authApi.register({ email, password });
    await login(email, password);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setAccessToken(null);
    setHttpAccessToken(null); // Sync with httpClient
    localStorage.removeItem("user");
    navigate("/login");
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


