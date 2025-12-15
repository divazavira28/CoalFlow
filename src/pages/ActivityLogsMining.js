import React, { useEffect, useState, useRef } from "react";
import "../styles/dashboard.css";
import "../styles/activitylogs.css"; // ==> Buat file CSS baru supaya rapi
import { apiGet } from "../utils/api";
import { loadChatbase } from "../utils/chatbaseLoader";
import miningLogo from "../assets/mining.png";


export default function ActivityLogsShipping() {
  const [logs, setLogs] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef(null);

  /* =======================================================
     LOAD CHATBASE
  ======================================================= */
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      loadChatbase();
      setTimeout(() => {
        const bubble = document.querySelector("#chatbase-bubble-button");
        const msg = document.querySelector("#chatbase-message-bubbles");
        const win = document.querySelector("#chatbase-bubble-window");

        if (bubble) bubble.style.display = "block";
        if (msg) msg.style.display = "block";
        if (win) win.style.display = "none";
      }, 800);
    }
  }, []);

  /* =======================================================
     FETCH USER INFO
  ======================================================= */
  useEffect(() => {
    apiGet("/me")
      .then((data) => setUserInfo(data))
      .catch((err) => console.error(err));
  }, []);

  /* =======================================================
     GET SHIPPING HISTORY
  ======================================================= */
  useEffect(() => {
    apiGet("/history/mining")
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error loading history:", err));
  }, []);

  /* =======================================================
     CLOSE DROPDOWN CLICK OUTSIDE
  ======================================================= */
  useEffect(() => {
    const handler = (evt) => {
      if (dropdownRef.current && !dropdownRef.current.contains(evt.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  /* =======================================================
     UI RENDER
  ======================================================= */
  return React.createElement(
    "div",
    { className: "dashboard-container" },

    /* SIDEBAR */
    React.createElement(
      "aside",
      { className: "sidebar" },

      React.createElement(
                              "div",
                              { className: "sidebar-header" },
                              React.createElement("img", {
                          src: miningLogo,
                          className: "logo-mining",
                          alt: "Mining Logo",
                      }),
        React.createElement("span", null, "CoalFlow")
      ),

      React.createElement(
        "nav",
        { className: "sidebar-menu" },

        React.createElement(
          "a",
          { href: "/dashboard/mining" },
          React.createElement("i", { className: "fa-solid fa-chart-line" }),
          "Dashboard"
        ),

        React.createElement(
          "a",
          { href: "/mining/calculation" },
          React.createElement("i", { className: "fa-solid fa-file-waveform" }),
          "Calculation"
        ),

        React.createElement(
          "a",
          { href: "/dashboard/mining/logs", className: "active" },
          React.createElement("i", { className: "fa-solid fa-list" }),
          "Activity Logs"
        ),

        React.createElement(
            "a",
            { href: "/summary" },
            React.createElement("i", { className: "fa-solid fa-diagram-project" }),
            "Summary"
          )
      )
    ),

    /* MAIN CONTENT */
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
          "Mining Activity Logs"
        ),

        React.createElement(
          "div",
          {
            className: "top-profile-btn",
            onClick: (e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            },
            ref: dropdownRef
          },
          React.createElement("i", { className: "fa-solid fa-user" }),
          React.createElement(
            "span",
            null,
            userInfo ? userInfo.display_name : "Loading..."
          ),

          dropdownOpen &&
            React.createElement(
              "div",
              { className: "profile-dropdown-modern" },

              React.createElement(
                "div",
                { className: "dropdown-header" },
                React.createElement(
                  "h4",
                  { className: "dropdown-name" },
                  userInfo?.display_name
                ),
                React.createElement(
                  "p",
                  { className: "dropdown-email" },
                  userInfo?.email
                )
              ),

              React.createElement("div", { className: "dropdown-divider" }),

              React.createElement(
                "a",
                { href: "/profile", className: "dropdown-item" },
                React.createElement("i", { className: "fa-solid fa-user" }),
                "Edit profile"
              ),

              React.createElement(
                "a",
                { href: "/settings", className: "dropdown-item" },
                React.createElement("i", { className: "fa-solid fa-gear" }),
                "Account settings"
              ),

              React.createElement("div", { className: "dropdown-divider" }),

              React.createElement(
                "a",
                { className: "dropdown-item logout", onClick: handleLogout },
                React.createElement("i", { className: "fa-solid fa-right-from-bracket" }),
                "Sign out"
              )
            )
        )
      ),

      /* LOG LIST */
      React.createElement(
        "div",
        { className: "logs-container" },

        logs.length === 0 &&
          React.createElement(
            "p",
            { className: "no-logs" },
            "No activity logs found."
          ),

        logs.map((log, i) =>
          React.createElement(
            "div",
            { className: "log-card", key: i },

            React.createElement(
              "div",
              { className: "log-header" },
              React.createElement(
                "h3",
                null,
                `Log #${i + 1}`
              ),
              React.createElement(
                "span",
                { className: "log-date" },
                new Date(log.timestamp).toLocaleString()
              )
            ),

            React.createElement("h4", { className: "section-title" }, "Input Values"),

            React.createElement(
              "ul",
              { className: "log-list" },
              Object.entries(log.input).map(([k, v]) =>
                React.createElement(
                  "li",
                  { key: k },
                  React.createElement("strong", null, `${k}: `),
                  String(v)
                )
              )
            ),

            React.createElement("h4", { className: "section-title" }, "Prediction Output"),

            React.createElement(
              "p",
              { className: "output-text" },
              `Predicted mining Output: ${log.output.prediksi_produksi_ton} tons`
            )
          )
        )
      )
    )
  );
}
