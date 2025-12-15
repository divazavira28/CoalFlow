import React, { useState, useEffect, useRef } from "react";
import "../styles/dashboard.css";       // sidebar & layout dari dashboard
import "../styles/calculation.css";     // styling khusus halaman Calculation
import { apiPost, apiGet } from "../utils/api";
import { loadChatbase } from "../utils/chatbaseLoader";
import miningLogo from "../assets/mining.png";



function menuItem(href, icon, label, onClick = null) {
  return React.createElement(
    "a",
    { href, onClick, className: "dropdown-item" },
    React.createElement("i", { className: `fa-solid ${icon}` }),
    label
  );
}

export default function CalculationMining() {

  // ==============================
  // DROPDOWN + USER INFO
  // ==============================
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef(null);
  const [loadingPredict, setLoadingPredict] = useState(false);


  // Load Chatbase
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

  // Fetch user info
  useEffect(() => {
    apiGet("/me")
      .then((data) => setUserInfo(data))
      .catch(() => { });
  }, []);

  // Close dropdown
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

  // ==============================
  // MINING INPUT
  // ==============================
  const [miningInput, setMiningInput] = useState({
    availability_: "",
    utilization_: "",
    truck_count: "",
    rainfall_mm: "",
    avg_haul_distance_km: "",
    availability_util_ratio: "",
    rain_category: "",
    predicted_output: "",
    production_per_truck: ""
  });

  const [predictResult, setPredictResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);


  const limits = {
    availability_: { min: 80, max: 99 },
    utilization_: { min: 71, max: 99 },
    truck_count: { min: 10, max: 39 },
    rainfall_mm: { min: 0, max: 49 },
    avg_haul_distance_km: { min: 1.1, max: 9.8 }
  };

  const placeholders = {
    availability_: "80 – 99",
    utilization_: "71 – 99",
    truck_count: "10 – 39",
    rainfall_mm: "0 – 49",
    avg_haul_distance_km: "1.1 – 9.8",
    availability_util_ratio: "Auto",
    rain_category: "Auto",
    predicted_output: "Auto",
    production_per_truck: "Auto"
  };

  // ==============================
  // HANDLE INPUT
  // ==============================
  function handleMiningInput(e) {
    const { name, value } = e.target;

    let updated = { ...miningInput, [name]: value };

    // smooth limit max
    if (limits[name]) {
      const { max } = limits[name];
      const num = parseFloat(value);
      if (!isNaN(num) && num > max) {
        updated[name] = String(max);
      }
    }

    // auto compute ratio
    const a = parseFloat(updated.availability_);
    const u = parseFloat(updated.utilization_);
    if (!isNaN(a) && !isNaN(u) && u > 0) {
      updated.availability_util_ratio = (a / u).toFixed(3);
    }

    // auto rain category
    const r = parseFloat(updated.rainfall_mm);
    if (!isNaN(r)) {
      if (r <= 2) updated.rain_category = "Clear";
      else if (r <= 10) updated.rain_category = "Light Rain";
      else if (r <= 25) updated.rain_category = "Moderate Rain";
      else updated.rain_category = "Heavy Rain";
    }

    setMiningInput(updated);
  }

  // ==============================
  // HANDLE BLUR → apply min/max
  // ==============================
  function handleMiningBlur(e) {
    const { name, value } = e.target;

    if (!limits[name]) return;

    const num = parseFloat(value);
    if (isNaN(num)) return;

    const { min, max } = limits[name];
    let corrected = num;

    if (num < min) corrected = min;
    if (num > max) corrected = max;

    setMiningInput((prev) => ({ ...prev, [name]: corrected.toString() }));
  }

  // ==============================
  // HANDLE PREDICT
  // ==============================
  async function handlePredict() {
    setLoadingPredict(true);  // <-- mulai loading
    setAiResult(null);

    try {
      const clean = {
        availability_: Number(miningInput.availability_),
        utilization_: Number(miningInput.utilization_),
        truck_count: Number(miningInput.truck_count),
        rainfall_mm: Number(miningInput.rainfall_mm),
        avg_haul_distance_km: Number(miningInput.avg_haul_distance_km),
        availability_util_ratio:
          miningInput.availability_util_ratio !== "" ? Number(miningInput.availability_util_ratio) : null,
        rain_category: miningInput.rain_category || null,
        production_per_truck: null
      };

      const result = await apiPost("/predict", clean);
      const predicted = result.prediksi_produksi_ton;

      setPredictResult(predicted);
      setLastPayload(clean);

      setMiningInput((prev) => ({
        ...prev,
        predicted_output: predicted,
        production_per_truck:
          prev.truck_count > 0 ? (predicted / prev.truck_count).toFixed(2) : ""
      }));

      await handleAgentOptimizer(clean, predicted); // <-- tunggu AI selesai
    } catch (err) {
      alert("Prediction failed");
    }

    setLoadingPredict(false); // <-- hentikan loading
  }


  async function handleApprove() {
    if (!predictResult || !lastPayload) {
      alert("Tidak ada prediksi yang bisa di-approve.");
      return;
    }

    const body = {
      input: lastPayload,
      output: { prediksi_produksi_ton: predictResult },
      ai_result: aiResult
    };

    try {
      await apiPost("/approve-mining-log", body);
      alert("Berhasil disimpan ke Activity Logs!");
    } catch (err) {
      alert("Gagal menyimpan ke logs.");
    }
  }


  // ==============================
  // AI GEMINI
  // ==============================
 async function handleAgentOptimizer(input, pred) {
  try {
    const res = await apiPost("/ai/mining-optimization", {
      input,
      prediction: pred
    });

    setAiResult(res?.result || "⚠️ AI tidak mengembalikan hasil.");
  } catch (err) {
    console.error("AI ERROR:", err);
    if (err?.status === 429) {
      setAiResult("⚠️ AI sedang sibuk. Silakan tunggu sebentar.");
    } else {
      setAiResult("⚠️ Gagal memproses analisis AI.");
    }
  }
}


  // ==============================
  // RENDER UI
  // ==============================
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
          { href: "/dashboard" },
          React.createElement("i", { className: "fa-solid fa-chart-line" }),
          "Dashboard"
        ),
        React.createElement(
          "a",
          { href: "/mining/calculation", className: "active" },
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

        React.createElement(
          "h2",
          { className: "top-title" },
          "Mining Calculation & AI Optimization"
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

      /* FORM */
      React.createElement(
        "div",
        { className: "calc-container" },

        ...Object.keys(miningInput).map((key) =>
          React.createElement(
            "div",
            { className: "calc-row", key },

            React.createElement("label", { className: "calc-label" }, key),

            React.createElement("input", {
              type:
                key === "availability_util_ratio" ||
                  key === "rain_category" ||
                  key === "predicted_output" ||
                  key === "production_per_truck"
                  ? "text"
                  : "number",

              name: key,
              value: miningInput[key],
              onChange: handleMiningInput,
              onBlur: handleMiningBlur,
              placeholder: placeholders[key],
              readOnly:
                key === "availability_util_ratio" ||
                key === "rain_category" ||
                key === "predicted_output" ||
                key === "production_per_truck",
              className: "calc-input"
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
              React.createElement("span", null, "Optimalisasi sedang berjalan...")
            )
            : "Predict & Optimize"
        ),


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
          React.createElement("p", null, `${predictResult} tons`)
        ),

        aiResult &&
        React.createElement(
          "div",
          { className: "calc-ai-box" },
          React.createElement("h3", null, "AI Optimization"),
          React.createElement("pre", { className: "calc-ai-text" }, aiResult)
        )
      )
    )
  );
}
