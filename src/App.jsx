import React from "react";
import "./App.css";

import { AuthProvider } from "./auth/AuthContext";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-100 min-h-screen">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}
