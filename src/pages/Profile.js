import React, { useState, useEffect, useRef } from "react";
import "../styles/profile.css";
import { apiGet } from "../utils/api";
import miningLogo from "../assets/mining.png";
import shippingLogo from "../assets/shipping.png";

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

export default function Profile() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const dropdownRef = useRef(null);

    // ============================================
    // FETCH USER DATA
    // ============================================
    useEffect(() => {
        apiGet("/me")
            .then((data) => {
                setUserInfo(data);
            })
            .catch((err) => console.error("Error fetching user:", err));
    }, []);

    // ============================================
    // CLOSE DROPDOWN ON CLICK OUTSIDE
    // ============================================
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

    return React.createElement(
        "div",
        { className: "profile-container" },

        /* ================= SIDEBAR ================= */
        React.createElement(
            "aside",
            { className: "sidebar" },

            React.createElement(
                "div",
                { className: "sidebar-header" },
                React.createElement("img", {
                    src: userInfo?.role === "shipping" ? shippingLogo : miningLogo,
                    className: userInfo?.role === "shipping" ? "logo-shipping" : "logo-mining",
                    alt: userInfo?.role === "shipping" ? "Shipping Logo" : "Mining Logo"
                }),
                React.createElement("span", null, "CoalFlow")
            ),

            // SIDEBAR MENU SESUAI ROLE
            React.createElement(
                "nav",
                { className: "sidebar-menu" },

                // Dashboard
                React.createElement(
                    "a",
                    {
                        href: userInfo?.role === "shipping" ? "/dashboard/shipping" : "/dashboard",
                    },
                    React.createElement("i", { className: "fa-solid fa-chart-line" }),
                    "Dashboard"
                ),

                // Calculation
                React.createElement(
                    "a",
                    {
                        href: userInfo?.role === "shipping"
                            ? "/shipping/CalculationShipping"
                            : "/mining/calculation",
                    },
                    React.createElement("i", { className: "fa-solid fa-file-lines" }),
                    "Calculation"
                ),

                // Activity Logs
                React.createElement(
                    "a",
                    {
                        href: userInfo?.role === "shipping"
                            ? "/dashboard/shipping/logs"
                            : "/dashboard/mining/logs",
                    },
                    React.createElement("i", { className: "fa-solid fa-list" }),
                    "Activity Logs"
                ),

                // Summary (Sama untuk semua role)
                React.createElement(
                    "a",
                    { href: "/summary" },
                    React.createElement("i", { className: "fa-solid fa-diagram-project" }),
                    "Summary"
                )
            )
        ),

        /* ================= MAIN AREA ================= */
        React.createElement(
            "main",
            { className: "main-content" },

            /* ===== TOPBAR ===== */
            React.createElement(
                "div",
                { className: "topbar" },
                React.createElement("h2", { className: "top-title" }, "Profile"),

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
                        userInfo?.display_name || "Loading..."
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

            /* ===================================================
             * PROFILE SUMMARY CARD
             ==================================================== */
            React.createElement(
                "div",
                { className: "profile-card" },

                // LEFT: Avatar & Info
                React.createElement(
                    "div",
                    { className: "profile-card-left" },

                    React.createElement("img", {
                        src: "https://i.pravatar.cc/150",
                        className: "profile-avatar",
                        alt: "profile",
                    }),

                    React.createElement(
                        "div",
                        { className: "profile-basic-info" },
                        React.createElement(
                            "h3",
                            { className: "profile-name" },
                            userInfo?.display_name || "Your Name"
                        ),
                        React.createElement(
                            "p",
                            { className: "profile-role" },
                            (userInfo?.role || "User") +
                            "  |  Indonesia"
                        )
                    )
                ),

                // RIGHT: Social + Edit
                React.createElement(
                    "div",
                    { className: "profile-card-right" },
                    React.createElement(
                        "button",
                        { className: "icon-btn" },
                        React.createElement("i", { className: "fa-brands fa-facebook" })
                    ),
                    React.createElement(
                        "button",
                        { className: "icon-btn" },
                        React.createElement("i", { className: "fa-brands fa-x-twitter" })
                    ),
                    React.createElement(
                        "button",
                        { className: "icon-btn" },
                        React.createElement("i", { className: "fa-brands fa-linkedin" })
                    ),
                    React.createElement(
                        "button",
                        { className: "icon-btn" },
                        React.createElement("i", { className: "fa-brands fa-instagram" })
                    ),

                    React.createElement(
                        "button",
                        { className: "edit-btn" },
                        React.createElement("i", { className: "fa-solid fa-pen" }),
                        " Edit"
                    )
                )
            ),

            /* ===================================================
             * PERSONAL INFORMATION
             ==================================================== */
            React.createElement(
                "div",
                { className: "info-card" },
                React.createElement(
                    "div",
                    { className: "info-card-header" },
                    React.createElement("h3", null, "Personal Information"),
                    React.createElement(
                        "button",
                        { className: "edit-btn-sm" },
                        React.createElement("i", { className: "fa-solid fa-pen" }),
                        " Edit"
                    )
                ),

                // Content grid
                React.createElement(
                    "div",
                    { className: "info-grid" },

                    infoRow("First Name", userInfo?.name?.split(" ")[0] || "-"),
                    infoRow("Last Name", userInfo?.name?.split(" ")[1] || "-"),
                    infoRow("Email address", userInfo?.email || "-"),
                    infoRow("Phone", userInfo?.phone || "-"),
                    infoRow("Bio", userInfo?.bio || "-")
                )
            ),

            /* ===================================================
             * ADDRESS
             ==================================================== */
            React.createElement(
                "div",
                { className: "info-card" },
                React.createElement(
                    "div",
                    { className: "info-card-header" },
                    React.createElement("h3", null, "Address"),
                    React.createElement(
                        "button",
                        { className: "edit-btn-sm" },
                        React.createElement("i", { className: "fa-solid fa-pen" }),
                        " Edit"
                    )
                ),

                React.createElement(
                    "div",
                    { className: "info-grid" },
                    infoRow("Country", "Indonesia"),
                    infoRow("City/State", "Jakarta"),
                    infoRow("Postal Code", "12345"),
                    infoRow("TAX ID", "ID-88292111")
                )
            )
        )
    );
}

/* ======================================================
   Helper Component Row
====================================================== */
function infoRow(label, value) {
    return React.createElement(
        "div",
        { className: "info-item" },
        React.createElement("label", null, label),
        React.createElement("p", null, value)
    );
}
