import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("idToken");

  if (!token) {
    return React.createElement(Navigate, { to: "/login", replace: true });
  }

  return children;
}
