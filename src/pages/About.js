import React, { useEffect } from "react";
import "../styles/about.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import aboutImage from "../assets/about.jpeg";
export default function About() {

  // ================= SCROLL REVEAL =================
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    function handleScroll() {
      const windowHeight = window.innerHeight;

      reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 120;

        if (elementTop < windowHeight - elementVisible) {
          el.classList.add("active");
        }
      });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return React.createElement(
    "div",
    { className: "about-wrapper" },

    React.createElement(Navbar),

    // ===== HERO / HEADER =====
    React.createElement(
      "section",
      { className: "about-header reveal" },
      React.createElement("h1", { className: "about-title" }, "Tentang CoalFlow"),
      React.createElement(
        "p",
        { className: "about-subtitle" },
        "Sistem manajemen batubara modern yang dirancang untuk memastikan proses monitoring, pencatatan, dan pelaporan berjalan secara efisien, akurat, dan real-time."
      )
    ),

    // ===== ABOUT SECTION =====
    React.createElement(
      "section",
      { className: "about-section" },

      React.createElement(
        "div",
        { className: "about-content" },

        // LEFT TEXT
        React.createElement(
          "div",
          { className: "about-text reveal" },
          React.createElement("h2", null, "Visi & Misi"),
          React.createElement(
            "p",
            null,
            "CoalFlow dikembangkan untuk membantu industri dalam mengelola alur batubara dengan lebih efektif, mulai dari proses masuk, keluar, hingga pemantauan stok secara menyeluruh."
          ),
          React.createElement(
            "p",
            null,
            "Dengan teknologi pelacakan modern dan interface yang intuitif, CoalFlow memastikan setiap data tercatat secara aman dan mudah diakses."
          )
        ),

        // RIGHT IMAGE
        React.createElement(
          "div",
          { className: "about-illustration reveal" },

          React.createElement(
            "div",
            { className: "floating" },

            React.createElement("img", {
              src: aboutImage,
              alt: "About CoalFlow",
              className: "about-image"
            }),
          )
        )
      )
    ),


    // ===== FEATURES SECTION (KELUAR DARI HERO!) =====
    React.createElement(
      "section",
      { className: "features-section" },

      React.createElement(
        "h2",
        { className: "features-title reveal" },
        "Mengapa CoalFlow?"
      ),


      React.createElement(
        "div",
        { className: "features-grid" },

        React.createElement(
          "div",
          { className: "reveal" },
          React.createElement(
            "div",
            { className: "feature-card" },
            React.createElement("i", { className: "fa-solid fa-gauge-high value-icon" }),
          React.createElement("h3", null, "Realtime Monitoring"),
          React.createElement("p", null, "Pantau pergerakan batubara secara langsung dengan visualisasi modern.")
        )
        ),

        React.createElement(
          "div",
          { className: "reveal" },
          React.createElement(
            "div",
            { className: "feature-card" },
            React.createElement("i", { className: "fa-solid fa-lock value-icon" }),
          React.createElement("h3", null, "Keamanan Data"),
          React.createElement("p", null, "Setiap transaksi dicatat aman dalam sistem yang terenkripsi.")
        )
        ),

        React.createElement(
          "div",
          { className: "reveal" },
          React.createElement(
            "div",
            { className: "feature-card" },
            React.createElement("i", { className: "fa-solid fa-laptop-code value-icon" }),
          React.createElement("h3", null, "Teknologi Modern"),
          React.createElement("p", null, "Menggunakan desain UI/UX profesional dan teknologi web terkini.")
        )
        )
      )
    ),


      // ===== FOOTER =====
      React.createElement(Footer)

        );
}
