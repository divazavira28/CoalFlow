import React from "react";

export default function Hero() {
  return React.createElement(
    "section",
    { className: "py-32 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white" },

    React.createElement(
      "h1",
      { className: "text-5xl font-bold mb-4" },
      "CAPSTONE PROJECT"
    ),

    React.createElement(
      "p",
      { className: "text-xl opacity-90" },
      "DIVA, HANI, GANI, SAM, RIKO"
    )
  );
}
