import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return React.createElement(
    "footer",
    { className: "footer-container" },

    React.createElement(
      "div",
      { className: "footer-content" },


      React.createElement(
        "p",
        { className: "footer-copy" },
        "© 2025 CoalFlow — All Rights Reserved"
      )
    )
  );
}
