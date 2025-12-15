import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import About from "../pages/About";
import Unauthorized from "../pages/Unauthorized";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import Calculation from "../pages/calculation";
import CalculationShipping from "../pages/CalculationShipping";

import DashboardMining from "../pages/DashboardMining";
import DashboardShipping from "../pages/DashboardShipping";

import Profile from "../pages/Profile";

import ActivityLogsMining from "../pages/ActivityLogsMining";
import ActivityLogsShipping from "../pages/ActivityLogsShipping";

import Summary from "../pages/Summary";



// ======================================================
// FIX: REDIRECTOR DITARUH DI ATAS
// ======================================================
function DashboardRedirect() {
  const role = localStorage.getItem("role");

  if (role === "mining") {
    window.location.href = "/dashboard/mining";
  } else if (role === "shipping") {
    window.location.href = "/dashboard/shipping";
  } else {
    window.location.href = "/unauthorized";
  }

  return null;
}



// ======================================================
// MAIN ROUTER
// ======================================================
export default function AppRouter() {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      Routes,
      null,

      // PUBLIC ROUTES
      React.createElement(Route, {
        path: "/",
        element: React.createElement(Home),
      }),
      React.createElement(Route, {
        path: "/about",
        element: React.createElement(About),
      }),
      React.createElement(Route, {
        path: "/login",
        element: React.createElement(Login),
      }),
      React.createElement(Route, {
        path: "/signup",
        element: React.createElement(Signup),
      }),
      React.createElement(Route, {
        path: "/unauthorized",
        element: React.createElement(Unauthorized),
      }),

      // AUTO REDIRECT DASHBOARD
      React.createElement(Route, {
        path: "/dashboard",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(DashboardRedirect)
        ),
      }),

      // MINING DASHBOARD
      React.createElement(Route, {
        path: "/dashboard/mining",
        element: React.createElement(
          RoleProtectedRoute,
          { allowedRole: "mining" },
          React.createElement(DashboardMining)
        ),
      }),

      // MINING CALCULATION PAGE
      React.createElement(Route, {
        path: "/mining/calculation",
        element: React.createElement(
          RoleProtectedRoute,
          { allowedRole: "mining" },
          React.createElement(Calculation)
        ),
      }),

      // NEW — MINING ACTIVITY LOGS
      React.createElement(Route, {
        path: "/dashboard/mining/logs",
        element: React.createElement(
          RoleProtectedRoute,
          { allowedRole: "mining" },
          React.createElement(ActivityLogsMining)
        ),
      }),

      // SHIPPING CALCULATION PAGE
      React.createElement(Route, {
        path: "/shipping/CalculationShipping",
        element: React.createElement(
          RoleProtectedRoute,
          { allowedRole: "shipping" },
          React.createElement(CalculationShipping)
        ),
      }),


      // SHIPPING DASHBOARD
      React.createElement(Route, {
        path: "/dashboard/shipping",
        element: React.createElement(
          RoleProtectedRoute,
          { allowedRole: "shipping" },
          React.createElement(DashboardShipping)
        ),
      }),

       // NEW — SHIPPING ACTIVITY LOGS
      React.createElement(Route, {
        path: "/dashboard/shipping/logs",
        element: React.createElement(
          RoleProtectedRoute,
          { allowedRole: "shipping" },
          React.createElement(ActivityLogsShipping)
        ),
      }),

      // PROFILE PAGE (untuk semua user yang sudah login)
      React.createElement(Route, {
        path: "/profile",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(Profile)
        ),
      }),

            // SUMMARY PAGE (untuk semua user yang sudah login)
      React.createElement(Route, {
        path: "/summary",
        element: React.createElement(
          ProtectedRoute,
          null,
          React.createElement(Summary)
        ),
      }),


    )
  );
}
