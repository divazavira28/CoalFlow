import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("idToken");
  const role = localStorage.getItem("role");

  // Jika tidak login
  if (!token) {
    return React.createElement(Navigate, { to: "/login", replace: true });
  }

  // Jika role tidak sesuai
  if (role !== allowedRole) {
    return React.createElement(Navigate, { to: "/unauthorized", replace: true });
  }

  return children;
}
