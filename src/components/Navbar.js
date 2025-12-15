import React, { useEffect } from "react";
import "../styles/navbar.css";

export default function Navbar() {

  // ======== SCROLL EFFECT =========
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector(".navbar");
      if (!nav) return;

      if (window.scrollY > 10) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup event listener saat komponen unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ========== NAVBAR UI ==========
  return React.createElement(
    "nav",
    { className: "navbar bg-white shadow py-4 px-6 flex justify-between items-center" },

    React.createElement("h1", { className: "text-xl font-bold" }, "CoalFlow"),

    React.createElement(
  "ul",
  { className: "flex gap-4" },

  // LOGIN
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      {
        href: "/login",
        className: "nav-link-item"
      },
      "Login"
    )
  ),

  // SIGNUP
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      {
        href: "/signup",
        className: "nav-link-item"
      },
      "Signup"
    )
  ),

  // ABOUT
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      {
        href: "/about",
        className: "nav-link-item"
      },
      "About"
    )
  )
)

  );
}
