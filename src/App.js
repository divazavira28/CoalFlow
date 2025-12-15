import React from "react";
import Home from "./pages/Home";
import "./App.css";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return React.createElement(
    "div",
    { className: "bg-gray-100 min-h-screen" },
    React.createElement(AppRouter)
  );
}
