import React, { useState, useEffect, useRef } from "react";
import "../styles/dashboard.css";
import { apiGet } from "../utils/api";
import { loadChatbase } from "../utils/chatbaseLoader";
import { getFullWeatherPack } from "../utils/weather";
import "../styles/weather.css";
import miningLogo from "../assets/mining.png";




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

export default function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [weather, setWeather] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const [location, setLocation] = useState({ city: "Loading...", country: "" });



  const dropdownRef = useRef(null);

  // unknown user
  useEffect(() => {
    async function attachUserNames() {
      if (!recentActivity.length) return;

      // Hanya jalankan sekali
      if (recentActivity.some(log => log.user_name)) return;

      const cachedUsers = {};

      const enhanced = await Promise.all(
        recentActivity.map(async (log) => {
          if (!log.user_uid) return { ...log, user_name: "Unknown User" };

          if (cachedUsers[log.user_uid]) {
            return { ...log, user_name: cachedUsers[log.user] };
          }

          try {
            const userData = await apiGet(`/user/${log.user_uid}`);
            cachedUsers[log.user] = userData.display_name;
            return { ...log, user_name: userData.display_name };
          } catch {
            return { ...log, user_name: "Unknown User" };
          }
        })
      );

      setRecentActivity(enhanced);
    }

    attachUserNames();
  }, [recentActivity]);


  // ALL ACTIVITY
  useEffect(() => {
    async function loadAllActivity() {
      try {
        const data = await apiGet("/history/all");
        setRecentActivity(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to load activity:", err);
      }
    }

    loadAllActivity();
  }, []);



  // load weather
  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getFullWeatherPack();
        setWeather(data);
        console.log("WEATHER PACK:", data);
      } catch (err) {
        console.log("Weather error:", err);
      }
    }

    loadWeather();
  }, []);


  // ===========================================
  // LOAD CHATBASE ONLY IF LOGGED IN + ON DASHBOARD
  // ===========================================
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

  /* ===========================
   REALTIME CLOCK
=========================== */
  useEffect(() => {
    function updateClock() {
      const now = new Date();  // <-- WAJIB ADA

      const day = now.toLocaleDateString("id-ID", { weekday: "long" });
      const date = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      const time = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      const formatted = `${day}, ${date} • ${time} WIB`;
      setCurrentTime(formatted);
    }

    updateClock(); // initial
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ===========================
     GET LOCATION VIA HTML5 Geolocation
  =========================== */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ city: "Unknown", country: "" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const data = await apiGet(`/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          setLocation({
            city: data.city || "Unknown",
            country: data.country || ""
          });
        } catch (err) {
          setLocation({ city: "Unknown", country: "" });
        }
      },
      () => setLocation({ city: "Unknown", country: "" }),
      { enableHighAccuracy: true }
    );
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

    window.location.href = "/";
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
          { href: "/dashboard", className: "active" },
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
          { href: "/summary" },
          React.createElement("i", { className: "fa-solid fa-diagram-project" }),
          "Summary"
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

        // LEFT SIDE (TITLE + TIME)
        React.createElement(
          "div",
          { className: "topbar-left" },

          React.createElement(
            "h2",
            { className: "top-title" },
            "Dashboard Overview"
          ),

          React.createElement(
            "p",
            { className: "time-display" },
            React.createElement("i", { className: "fa-regular fa-clock time-icon" }),
            ` ${currentTime}`
          )
        ),

        // RIGHT SIDE PROFILE BUTTON
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
            userInfo ? userInfo.display_name : "Loading..."
          ),

          dropdownOpen &&
          React.createElement(
            "div",
            { className: "profile-dropdown-modern" },

            // HEADER (NAME + EMAIL)
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

            // MENU LISTS
            menuItem("/profile", "fa-user", "Edit profile"),
            menuItem("/settings", "fa-gear", "Account settings"),
            menuItem("#", "fa-circle-info", "Support"),

            React.createElement("div", { className: "dropdown-divider" }),

            // SIGN OUT BUTTON
            React.createElement(
              "a",
              { className: "dropdown-item logout", onClick: handleLogout },
              React.createElement("i", { className: "fa-solid fa-right-from-bracket" }),
              "Sign out"
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
          React.createElement("h3", null, "Total Mining"),
          React.createElement("p", { className: "card-value" }, "2,945 Tons")
        ),

        React.createElement(
          "div",
          { className: "card" },
          React.createElement("i", {
            className: "fa-solid fa-dolly card-icon green",
          }),
          React.createElement("h3", null, "Total Shipping"),
          React.createElement("p", { className: "card-value" }, "1,820 Tons")
        ),

        React.createElement(
          "div",
          { className: "card" },
          React.createElement("i", {
            className: "fa-solid fa-boxes-stacked card-icon orange",
          }),
          React.createElement("h3", null, "Current Coal Stock"),
          React.createElement("p", { className: "card-value" }, "1,125 Tons")
        )
      ),

      /* ================= LOAD WEATHER ================= */
      weather &&
      React.createElement(
        "div",
        { className: "weather-box" },

        // TITLE
        React.createElement("h3", { className: "weather-title" }, "Weather Insights"),

        React.createElement(
          "div",
          { className: "location-text" },
          React.createElement("i", {
            className: "fa-solid fa-location-dot",
            style: { marginRight: "6px", color: "#2563EB" }
          }),
          `${location.city || "Unknown"}, ${location.country || ""}`
        ),


        // CURRENT WEATHER
        React.createElement(
          "div",
          { className: "weather-current" },

          React.createElement("p", null, `Condition: ${weather.current.condition}`),
          React.createElement("p", null, `Temperature: ${weather.current.temp} °C`),
          React.createElement("p", null, `Humidity: ${weather.current.humidity}%`),
          React.createElement("p", null, `Wind: ${weather.current.wind} m/s`),
          React.createElement("p", null, `Rain (1h): ${weather.current.rain_1h} mm`)
        ),

        // RISK ANALYSIS
        React.createElement(
          "div",
          { className: "weather-risk" },
          React.createElement("h4", null, "Production Risk Level:"),
          React.createElement(
            "span",
            { className: `risk-tag risk-${weather.risk.toLowerCase()}` },
            weather.risk
          )
        ),

        // FORECAST LIST
        React.createElement(
          "div",
          { className: "weather-forecast" },

          React.createElement("h4", null, "Next 12-Hour Rainfall Forecast"),

          ...weather.forecast.map((fc) =>
            React.createElement(
              "div",
              { className: "forecast-item", key: fc.time },
              React.createElement("span", null, fc.time),
              React.createElement(
                "span",
                { className: "forecast-rain" },
                `${fc.rain_mm} mm`
              )
            )
          )
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

            // Jika tidak ada data
            recentActivity.length === 0 &&
            React.createElement(
              "tr",
              { key: "empty" },
              React.createElement(
                "td",
                { colSpan: 4, style: { textAlign: "center", padding: "12px", color: "#777" } },
                "No recent activity."
              )
            ),

            // Jika ada data
            ...recentActivity.map((item, index) =>
              React.createElement(
                "tr",
                { key: index },

                // DATE
                React.createElement(
                  "td",
                  null,
                  new Date(item.timestamp).toLocaleString("id-ID")
                ),

                // TYPE
                React.createElement(
                  "td",
                  null,
                  item._type === "mining" ? "Mining Prediction" : "Shipping Prediction"
                ),

                // AMOUNT
                React.createElement(
                  "td",
                  null,
                  item._type === "mining"
                    ? `${item.output.prediksi_produksi_ton} Tons`
                    : `${item.output.prediksi_shipping_ton} Tons`
                ),

                // USER
                React.createElement(
                  "td",
                  null,
                  item.user_name || "Unknown User"
                )
              )
            )
          )
        )
      )
    )
  )
}