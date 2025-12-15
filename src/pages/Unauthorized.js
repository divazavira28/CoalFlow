import React from "react";

export default function Unauthorized() {
  return React.createElement(
    "div",
    { style: { padding: "30px", textAlign: "center" } },
    React.createElement("h1", null, "403 - Access Denied"),
    React.createElement("p", null, "You do not have permission to access this page."),
    React.createElement("a", { href: "/dashboard" }, "Back to Dashboard")
  );
}
