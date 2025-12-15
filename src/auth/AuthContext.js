import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [uid, setUid] = useState(localStorage.getItem("uid") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (idToken, uid, role) => {
    localStorage.setItem("token", idToken);
    localStorage.setItem("uid", uid);
    localStorage.setItem("role", role);

    setToken(idToken);
    setUid(uid);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("role");

    setToken(null);
    setUid(null);
    setRole(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { token, uid, role, loading, login, logout } },
    children
  );
}
