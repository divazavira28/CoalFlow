import React, { useState, useEffect, useRef } from "react";
import "../styles/dashboard.css";
import "../styles/calculation.css";
import { apiPost, apiGet } from "../utils/api";
import { loadChatbase } from "../utils/chatbaseLoader";
import shippingLogo from "../assets/shipping.png";



const GEMINI_API_KEY = "AIzaSyD7PkreDiSxktWnJvhWHBKY-_jql9ECi-8";

function menuItem(href, icon, label, onClick = null) {
  return React.createElement(
    "a",
    { href, onClick, className: "dropdown-item" },
    React.createElement("i", { className: `fa-solid ${icon}` }),
    label
  );
}

export default function CalculationShipping() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef(null);
  const [loadingPredict, setLoadingPredict] = useState(false);


  const [lastPayload, setLastPayload] = useState(null); // <- For APPROVE

  /* CHATBASE LOADING */
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (token) {
      loadChatbase();
      setTimeout(() => {
        const b = document.querySelector("#chatbase-bubble-button");
        const m = document.querySelector("#chatbase-message-bubbles");
        const w = document.querySelector("#chatbase-bubble-window");

        if (b) b.style.display = "block";
        if (m) m.style.display = "block";
        if (w) w.style.display = "none";
      }, 800);
    }
  }, []);

  /* FETCH USER */
  useEffect(() => {
    apiGet("/me")
      .then((d) => setUserInfo(d))
      .catch(() => { });
  }, []);

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  /* ===========================
     SHIPPING INPUTS
  =========================== */
  const [shipInput, setShipInput] = useState({
    cargo_ton: "",
    distance_nm: "",
    wave_height_m: "",
    wind_speed_knots: "",
    sea_condition_index: "",
    sea_condition_score: "",
    speed_knots_est: "",
    loading_efficiency: "",
    unloading_efficiency: "",

    ton_per_nm: "",
    profit_cost_ratio: "",
    fuel_efficiency: "",
    avg_ton_per_truck: ""
  });

  const [predictResult, setPredictResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);

  const placeholders = {
    cargo_ton: "500 – 20,000",
    distance_nm: "5 – 500",
    wave_height_m: "0 – 8",
    wind_speed_knots: "0 – 40",
    sea_condition_index: "0 – 10",
    sea_condition_score: "0 – 100",
    speed_knots_est: "5 – 25",
    loading_efficiency: "0.5 – 1.0",
    unloading_efficiency: "0.5 – 1.0",
    ton_per_nm: "Auto",
    profit_cost_ratio: "Auto",
    fuel_efficiency: "Auto",
    avg_ton_per_truck: "Auto"
  };

  const limits = {
    cargo_ton: { min: 500, max: 20000 },
    distance_nm: { min: 5, max: 500 },
    wave_height_m: { min: 0, max: 8 },
    wind_speed_knots: { min: 0, max: 40 },
    sea_condition_index: { min: 0, max: 10 },
    sea_condition_score: { min: 0, max: 100 },
    speed_knots_est: { min: 5, max: 25 },
    loading_efficiency: { min: 0.5, max: 1.0 },
    unloading_efficiency: { min: 0.5, max: 1.0 }
  };

  /* HANDLE INPUT */
  function handleInput(e) {
    const { name, value } = e.target;
    let updatedValue = value;

    if (limits[name]) {
      if (value === "" || value === "-" || value === "." || value === "-.") {
        setShipInput((prev) => ({ ...prev, [name]: value }));
        return;
      }

      const num = parseFloat(value);
      if (!isNaN(num) && num > limits[name].max) {
        updatedValue = String(limits[name].max);
      }
    }

    const updated = { ...shipInput, [name]: updatedValue };

    const cargo = parseFloat(updated.cargo_ton);
    const dist = parseFloat(updated.distance_nm);

    if (!isNaN(cargo) && !isNaN(dist) && dist > 0)
      updated.ton_per_nm = (cargo / dist).toFixed(2);

    const speed = parseFloat(updated.speed_knots_est);
    if (!isNaN(speed)) updated.fuel_efficiency = (speed / 10).toFixed(2);

    if (!isNaN(cargo)) updated.avg_ton_per_truck = (cargo / 30).toFixed(2);

    const wv = parseFloat(updated.wave_height_m);
    const wd = parseFloat(updated.wind_speed_knots);

    if (!isNaN(wv) && !isNaN(wd))
      updated.profit_cost_ratio = (100 / (1 + wv + wd)).toFixed(2);

    setShipInput(updated);
  }

  /* HANDLE BLUR */
  function handleBlur(e) {
    const { name, value } = e.target;
    if (!limits[name]) return;

    const num = parseFloat(value);
    if (isNaN(num)) return;

    let corrected = num;
    if (num < limits[name].min) corrected = limits[name].min;
    if (num > limits[name].max) corrected = limits[name].max;

    setShipInput((prev) => ({ ...prev, [name]: corrected.toString() }));
  }

  /* PREDICT */
  async function handlePredict() {
    try {
      setLoadingPredict(true); // ⬅ mulai loading

      const cleanInput = shipInput;
      const result = await apiPost("/predict-shipping", cleanInput);

      setPredictResult(result.prediksi_shipping_ton);
      setLastPayload(cleanInput);

      localStorage.setItem("shipping_last_predict", result.prediksi_shipping_ton);

      await handleAgentOptimizer(cleanInput, result.prediksi_shipping_ton);

    } catch (err) {
      alert("Prediction failed");
    } finally {
      setLoadingPredict(false); // ⬅ stop loading
    }
  }


  /* AI OPTIMIZER */
  async function handleAgentOptimizer(input, pred) {
    try {
      const prompt = `
Anda adalah AI ahli optimisasi maritime logistics.

Input:
${JSON.stringify(input, null, 2)}

Prediksi: ${pred} ton

Berikan:
1. Risiko kondisi laut
2. Saran optimasi kecepatan & rute
3. Optimasi bahan bakar
4. Efisiensi loading/unloading
5. Perkiraan peningkatan performa
      `.trim();

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );

      const json = await res.json();

      setAiResult(
        json?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ AI tidak dapat memberikan analisis."
      );

    } catch (err) {
      setAiResult("⚠️ Terjadi kesalahan AI.");
    }
  }

  /* APPROVE: SAVE TO FIRESTORE */
  async function handleApprove() {
    if (!predictResult || !lastPayload) {
      alert("Belum ada data untuk di-approve.");
      return;
    }

    const body = {
      input: lastPayload,
      output: { prediksi_shipping_ton: predictResult },
      ai_result: aiResult
    };

    try {
      await apiPost("/approve-shipping-log", body);
      alert("✔ Data berhasil disimpan ke Activity Logs!");
    } catch (err) {
      alert("Gagal menyimpan ke logs.");
    }
  }

  /* RENDER UI */
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
          src: shippingLogo,
          className: "logo-shipping",
          alt: "Shipping Logo",
        }),
        React.createElement("span", null, "CoalFlow")
      ),

      React.createElement(
        "nav",
        { className: "sidebar-menu" },

        React.createElement(
          "a",
          { href: "/dashboard/shipping" },
          React.createElement("i", { className: "fa-solid fa-chart-line" }),
          "Dashboard"
        ),

        React.createElement(
          "a",
          { href: "/shipping/CalculationShipping", className: "active" },
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
        React.createElement("h2", { className: "top-title" }, "Shipping Calculation & AI Optimization"),

        React.createElement(
          "div",
          {
            className: "top-profile-btn",
            ref: dropdownRef,
            onClick: (e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }
          },

          React.createElement("i", { className: "fa-solid fa-user" }),
          React.createElement("span", null, userInfo ? userInfo.display_name : "Loading..."),

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

      /* FORM SECTION */
      React.createElement(
        "div",
        { className: "calc-container" },

        ...Object.keys(shipInput).map((key) =>
          React.createElement(
            "div",
            { className: "calc-row", key },

            React.createElement("label", { className: "calc-label" }, key),

            React.createElement("input", {
              name: key,
              type: "number",
              className: "calc-input",
              value: shipInput[key],
              placeholder: placeholders[key],
              onChange: handleInput,
              onBlur: handleBlur,
              readOnly:
                key === "ton_per_nm" ||
                key === "profit_cost_ratio" ||
                key === "fuel_efficiency" ||
                key === "avg_ton_per_truck"
            })
          )
        ),

        React.createElement(
          "button",
          {
            className: `calc-btn ${loadingPredict ? "loading-state" : ""}`,
            onClick: handlePredict,
            disabled: loadingPredict
          },

          loadingPredict
            ? React.createElement(
              "div",
              { className: "btn-loading-wrapper" },
              React.createElement("div", { className: "spinner-mini" }),
              "Optimalisasi sedang berjalan..."
            )
            : "Predict & Optimize"
        ),

        /* APPROVE BUTTON */
        predictResult &&
        React.createElement(
          "button",
          {
            className: "calc-btn",
            style: { backgroundColor: "#2b6cb0", marginTop: "10px" },
            onClick: handleApprove
          },
          "Approve to Activity Logs"
        ),

        predictResult &&
        React.createElement(
          "div",
          { className: "calc-result" },
          React.createElement("h3", null, "Prediction Result"),
          React.createElement("p", null, `Predicted Shipping Output: ${predictResult} tons`)
        ),

        aiResult &&
        React.createElement(
          "div",
          { className: "calc-ai-box" },
          React.createElement("h3", null, "AI Optimization"),
          React.createElement("pre", { className: "calc-ai-text" }, aiResult)
        ),
      )
    )
  );
}
