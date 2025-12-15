import React, { useEffect, useState, useRef } from "react";
import "../styles/dashboard.css";
import { apiGet, apiPost } from "../utils/api";
import { loadChatbase } from "../utils/chatbaseLoader";
import miningLogo from "../assets/summary.png";

function menuItem(href, icon, label, onClick = null) {
  return React.createElement(
    "a",
    {
      href,
      onClick,
      className: "dropdown-item"
    },
    React.createElement("i", { className: `fa-solid ${icon}` }),
    label
  );
}

export default function Summary() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);


  const dropdownRef = useRef(null);

  // ==============================
  // LOAD CHATBASE
  // ==============================
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

  // ==============================
  // FETCH USER INFO
  // ==============================
  useEffect(() => {
    apiGet("/me")
      .then((data) => setUserInfo(data))
      .catch(() => { });
  }, []);

  // ==============================
  // FETCH CORRELATION
  // ==============================
  useEffect(() => {
    async function loadCorrelation() {
      try {
        const data = await apiGet("/correlation");
        setCorrelation(data);
      } catch (err) {
        console.error("Error get correlation:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCorrelation();
  }, []);

  // ==============================
  // CLOSE DROPDOWN
  // ==============================
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  function handleLogout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("uid");
    localStorage.removeItem("role");
    window.location.href = "/";
  }

  const role = userInfo?.role || localStorage.getItem("role");

  async function handleSendEmail() {
  if (!correlation?.email_summary) {
    alert("Summary not available.");
    return;
  }

  const email = userInfo?.email;
  if (!email) {
    alert("Cannot detect your email.");
    return;
  }

  try {
    setSendingEmail(true);

    await apiPost("/send-summary-email", {
      email,
      summary: correlation.email_summary,
    });

    alert("Email sent successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to send email.");
  } finally {
    setSendingEmail(false);
  }
}



  // ==============================
  // RENDER
  // ==============================
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
          className: "logo-summary",
          alt: "Summary Logo",
        }),
        React.createElement("span", null, "CoalFlow")
      ),

      React.createElement(
        "nav",
        { className: "sidebar-menu" },

        role === "mining" &&
        React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "a",
            { href: "/dashboard/mining" },
            React.createElement("i", { className: "fa-solid fa-chart-line" }),
            "Dashboard"
          ),
          React.createElement(
            "a",
            { href: "/mining/calculation" },
            React.createElement("i", { className: "fa-solid fa-file-lines" }),
            "Calculation"
          ),
          React.createElement(
            "a",
            { href: "/dashboard/mining/logs" },
            React.createElement("i", { className: "fa-solid fa-list" }),
            "Activity Logs"
          ),
          React.createElement(
            "a",
            { href: "/summary", className: "active" },
            React.createElement("i", { className: "fa-solid fa-diagram-project" }),
            "Summary"
          )
        ),

        role === "shipping" &&
        React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "a",
            { href: "/dashboard/shipping" },
            React.createElement("i", { className: "fa-solid fa-chart-line" }),
            "Dashboard"
          ),
          React.createElement(
            "a",
            { href: "/shipping/CalculationShipping" },
            React.createElement("i", { className: "fa-solid fa-file-waveform" }),
            "Calculation"
          ),
          React.createElement(
            "a",
            { href: "/dashboard/shipping/logs" },
            React.createElement("i", { className: "fa-solid fa-list" }),
            "Activity Logs"
          ),
          React.createElement(
            "a",
            { href: "/summary", className: "active" },
            React.createElement("i", { className: "fa-solid fa-diagram-project" }),
            "Summary"
          ),
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
          "Mining & Shipping Correlation Summary"
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
                userInfo?.display_name || "Your Name"
              ),
              React.createElement(
                "p",
                { className: "dropdown-email" },
                userInfo?.email || "-"
              )
            ),

            React.createElement("div", { className: "dropdown-divider" }),

            menuItem("/profile", "fa-user", "Edit profile"),
            menuItem("/settings", "fa-gear", "Account settings"),

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

      /* CONTENT BODY */
      loading &&
      React.createElement(
        "p",
        null,
        "Loading correlation data..."
      ),

      !loading && !correlation &&
      React.createElement(
        "p",
        null,
        "Failed to load correlation."
      ),

      !loading && correlation && correlation.status === "insufficient_data" &&
      React.createElement(
        "p",
        null,
        "Not enough data to build correlation (butuh minimal 1 log mining & 1 log shipping)."
      ),

      !loading && correlation && correlation.status === "ok" &&
      React.createElement(
        React.Fragment,
        null,

        /* SUMMARY CARDS */
        React.createElement(
          "div",
          { className: "summary-cards" },

          React.createElement(
            "div",
            { className: "card" },
            React.createElement("i", {
              className: "fa-solid fa-mountain card-icon blue"
            }),
            React.createElement("h3", null, "Mining Prediction"),
            React.createElement(
              "p",
              { className: "card-value" },
              `${correlation.mining_pred} Tons`
            )
          ),

          React.createElement(
            "div",
            { className: "card" },
            React.createElement("i", {
              className: "fa-solid fa-ship card-icon green"
            }),
            React.createElement("h3", null, "Shipping Prediction"),
            React.createElement(
              "p",
              { className: "card-value" },
              `${correlation.shipping_pred} Tons`
            )
          ),

          React.createElement(
            "div",
            { className: "card" },
            React.createElement("i", {
              className: "fa-solid fa-scale-balanced card-icon orange"
            }),
            React.createElement("h3", null, "Shipping / Mining Ratio"),
            React.createElement(
              "p",
              { className: "card-value" },
              correlation.ratio !== null && correlation.ratio !== undefined
                ? correlation.ratio
                : "-"
            ),
            React.createElement(
              "p",
              { className: "card-label" },
              correlation.supply_chain_status
            )
          )
        ),

        /* RISK SECTION */
        React.createElement(
          "div",
          { className: "table-box" },
          React.createElement("h3", null, "Operational Risk Overview"),

          React.createElement(
            "table",
            { className: "activity-table" },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement("th", null, "Segment"),
                React.createElement("th", null, "Risk Level")
              )
            ),
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement("td", null, "Mining"),
                React.createElement("td", null, correlation.mining_risk)
              ),
              React.createElement(
                "tr",
                null,
                React.createElement("td", null, "Shipping"),
                React.createElement("td", null, correlation.shipping_risk)
              )
            )
          )
        ),

        /* EMAIL SUMMARY BOX */
        React.createElement(
          "div",
          { className: "table-box" },
          React.createElement("h3", null, "Email Summary (Copy & Paste)"),

          React.createElement(
            "textarea",
            {
              readOnly: true,
              style: {
                width: "100%",
                minHeight: "220px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontFamily: "monospace",
                fontSize: "0.95rem",
                whiteSpace: "pre-wrap",
                resize: "vertical"
              },
              value: correlation.email_summary
            }
          ),

          React.createElement(
  "button",
  {
    className: "calc-btn",
    style: { marginTop: "12px" },
    onClick: handleSendEmail,
    disabled: sendingEmail
  },
  sendingEmail
    ? React.createElement(
        "div",
        { className: "loading-inline" },
        React.createElement("div", { className: "spinner-mini" }),
        React.createElement("span", null, " Sending email...")
      )
    : "Send Summary to Email"
),


        )
      )
    )
  );
}
