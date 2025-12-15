import React from "react";
import Navbar from "../components/Navbar";
import "../styles/home.css";
import Footer from "../components/Footer";
import homeImage from "../assets/home.jpeg";
import { useEffect } from "react";




export default function Home() {

    useEffect(() => {
        const reveals = document.querySelectorAll(".reveal");

        function handleScroll() {
            const windowHeight = window.innerHeight;

            reveals.forEach((el) => {
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 100;

                if (elementTop < windowHeight - elementVisible) {
                    el.classList.add("active");
                }
            });
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // trigger awal

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return React.createElement(
        "div",
        { className: "home-wrapper" },

        React.createElement(Navbar),

        // ===== HERO SECTION =====
        React.createElement(
            "section",
            { className: "hero-section reveal" },

            React.createElement(
                "div",
                { className: "hero-content reveal" },


                React.createElement(
                    "h1",
                    { className: "hero-title" },
                    "CoalFlow – Smart Coal Management System"
                ),

                React.createElement(
                    "p",
                    { className: "hero-subtitle" },
                    "Monitoring alur batubara secara real-time, akurat, dan efisien dengan visualisasi modern berbasis AI."
                ),

                React.createElement(
                    "div",
                    { className: "hero-actions" },
                    React.createElement(
                        "a",
                        { href: "/dashboard", className: "hero-btn primary" },
                        "Masuk ke Dashboard"
                    ),
                    React.createElement(
                        "a",
                        { href: "/about", className: "hero-btn secondary" },
                        "Pelajari Lebih Lanjut"
                    )
                )
            ),


            React.createElement(
                "div",
                { className: "hero-illustration reveal" },
                React.createElement("img", {
                    src: homeImage,
                    alt: "CoalFlow Illustration",
                    className: "hero-image"
                })
            )
        ),

        // ===== FEATURES SECTION (KELUAR DARI HERO!) =====
        React.createElement(
            "section",
            { className: "features-section" },

            React.createElement(
                "h2",
                { className: "features-title reveal" },
                "Fitur Utama CoalFlow"
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
                        React.createElement("i", { className: "fa-solid fa-chart-line feature-icon" }),
                        React.createElement("h3", null, "Monitoring Realtime"),
                        React.createElement("p", null, "Pantau input-output batubara secara langsung dengan visualisasi modern.")
                    )
                ),

                React.createElement(
                    "div",
                    { className: "reveal" },
                    React.createElement(
                        "div",
                        { className: "feature-card" },
                        React.createElement("i", { className: "fa-solid fa-database feature-icon" }),
                        React.createElement("h3", null, "Data Terstruktur"),
                        React.createElement("p", null, "Setiap aktivitas tercatat otomatis dalam database yang rapi dan aman.")
                    )
                ),

                React.createElement(
                    "div",
                    { className: "reveal" },
                    React.createElement(
                        "div",
                        { className: "feature-card" },
                        React.createElement("i", { className: "fa-solid fa-truck feature-icon" }),
                        React.createElement("h3", null, "Alur Coalflow"),
                        React.createElement("p", null, "Pantau pergerakan batubara dari hulu ke hilir secara menyeluruh dan merata.")
                    )
                )
            )
        ),

        React.createElement(Footer)
    );
}

