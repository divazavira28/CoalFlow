import React, { useState, useEffect, useRef } from "react";
import "../styles/dashboard.css";
import { apiGet } from "../utils/api";

export default function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const dropdownRef = useRef(null);

  // ===============================
  // FETCH DATA USER (email, role)
  // ===============================
  useEffect(() => {
    apiGet("/me")
      .then((data) => {
        setUserInfo(data);
      })
      .catch((err) => {
        console.error("Error fetch user info:", err);
      });
  }, []);

  // ===============================
  // CLOSE DROPDOWN CLICK OUTSIDE
  // ===============================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ===============================
  // LOGOUT FUNCTION
  // ===============================
  function handleLogout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("uid");
    localStorage.removeItem("role");

    window.location.href = "/login";
  }

  return React.createElement(
    "div",
    { className: "dashboard-container" },

    /* ================= SIDEBAR ================= */
    React.createElement(
      "aside",
      { className: "sidebar" },

      React.createElement(
        "div",
        { className: "sidebar-header" },
        React.createElement("i", { className: "fa-solid fa-cubes" }),
        React.createElement("span", null, "CoalFlow")
      ),

      React.createElement(
        "nav",
        { className: "sidebar-menu" },
        React.createElement(
          "a",
          { href: "/dashboard", className: "active" },
          React.createElement("i", { className: "fa-solid fa-chart-line" }),
          "Dashboard"
        ),
        React.createElement(
          "a",
          { href: "/reports" },
          React.createElement("i", { className: "fa-solid fa-file-lines" }),
          "Reports"
        ),
        React.createElement(
          "a",
          { href: "/logs" },
          React.createElement("i", { className: "fa-solid fa-list" }),
          "Activity Logs"
        ),
        React.createElement(
          "a",
          { href: "/settings" },
          React.createElement("i", { className: "fa-solid fa-gear" }),
          "Settings"
        )
      )
    ),

    /* ================= MAIN CONTENT ================= */
    React.createElement(
      "main",
      { className: "main-content" },

      /* TOPBAR */
      React.createElement(
        "div",
        { className: "topbar" },

        React.createElement(
          "h2",
          { className: "top-title" },
          "Dashboard Overview"
        ),

        // ------------- PROFILE BUTTON + DROPDOWN -------------
        React.createElement(
          "div",
          {
            className: "top-profile-btn",
            onClick: (e) => {
              e.stopPropagation(); 
              setDropdownOpen(!dropdownOpen);
            },
            ref: dropdownRef,
          },

          React.createElement("i", { className: "fa-solid fa-user" }),

          React.createElement(
            "span",
            null,
            userInfo ? userInfo.email : "Loading..."
          ),

          dropdownOpen &&
            React.createElement(
              "div",
              { className: "profile-dropdown" },

              React.createElement(
                "a",
                { href: "/profile" },
                React.createElement("i", { className: "fa-solid fa-user-pen" }),
                "Edit Profile"
              ),

              React.createElement(
                "a",
                { href: "#", onClick: handleLogout },
                React.createElement("i", {
                  className: "fa-solid fa-right-from-bracket",
                }),
                "Sign Out"
              )
            )
        )
      ),

      /* ================= SUMMARY CARDS ================= */
      React.createElement(
        "div",
        { className: "summary-cards" },

        React.createElement(
          "div",
          { className: "card" },
          React.createElement("i", {
            className: "fa-solid fa-truck-loading card-icon blue",
          }),
          React.createElement("h3", null, "Total Coal In"),
          React.createElement("p", { className: "card-value" }, "2,945 Tons")
        ),

        React.createElement(
          "div",
          { className: "card" },
          React.createElement("i", {
            className: "fa-solid fa-dolly card-icon green",
          }),
          React.createElement("h3", null, "Total Coal Out"),
          React.createElement("p", { className: "card-value" }, "1,820 Tons")
        ),

        React.createElement(
          "div",
          { className: "card" },
          React.createElement("i", {
            className: "fa-solid fa-boxes-stacked card-icon orange",
          }),
          React.createElement("h3", null, "Current Stock"),
          React.createElement("p", { className: "card-value" }, "1,125 Tons")
        )
      ),

      /* ================= CHART + TABLE ================= */
      React.createElement(
        "div",
        { className: "content-row" },

        React.createElement(
          "div",
          { className: "chart-box" },
          React.createElement("h3", null, "Coal Movement Chart"),
          React.createElement(
            "div",
            { className: "chart-placeholder" },
            "Chart Placeholder (Connect Chart.js or Recharts)"
          )
        ),

        React.createElement(
          "div",
          { className: "table-box" },
          React.createElement("h3", null, "Recent Activity"),

          React.createElement(
            "table",
            { className: "activity-table" },

            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement("th", null, "Date"),
                React.createElement("th", null, "Type"),
                React.createElement("th", null, "Amount"),
                React.createElement("th", null, "User")
              )
            ),

            React.createElement(
              "tbody",
              null,

              React.createElement(
                "tr",
                null,
                React.createElement("td", null, "2025-11-28"),
                React.createElement("td", null, "Coal In"),
                React.createElement("td", null, "120 Tons"),
                React.createElement("td", null, "Operator A")
              ),

              React.createElement(
                "tr",
                null,
                React.createElement("td", null, "2025-11-27"),
                React.createElement("td", null, "Coal Out"),
                React.createElement("td", null, "80 Tons"),
                React.createElement("td", null, "Operator B")
              )
            )
          )
        )
      )
    )
  );
}