import React from "react";

export default function Features() {
  return React.createElement(
    "section",
    { className: "py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-6" },

    React.createElement(
      "div",
      { className: "p-6 bg-white shadow rounded" },
      React.createElement("h3", { className: "text-xl font-bold mb-2" }, "Fast"),
      React.createElement("p", null, "Vite membuat development super cepat.")
    ),

    React.createElement(
      "div",
      { className: "p-6 bg-white shadow rounded" },
      React.createElement("h3", { className: "text-xl font-bold mb-2" }, "Modern"),
      React.createElement("p", null, "React + Tailwind = modern workflow.")
    ),

    React.createElement(
      "div",
      { className: "p-6 bg-white shadow rounded" },
      React.createElement("h3", { className: "text-xl font-bold mb-2" }, "Flexible"),
      React.createElement("p", null, "Full JavaScript tanpa JSX bekerja mulus.")
    )
  );
}
