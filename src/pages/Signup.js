import React, { useState } from "react";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // default
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmShow, setConfirmShow] = useState(false);

  const [passwordError, setPasswordError] = useState("");


  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }


    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          display_name: fullName,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Signup gagal");
        setLoading(false);
        return;
      }

      alert("Akun berhasil dibuat. Silakan login.");
      setLoading(false);
      navigate("/login");

    } catch (error) {
      console.log("Signup Error:", error);
      alert("Server error");
      setLoading(false);
    }
  };


  return React.createElement(
    "div",
    { className: "auth-wrapper" },

    React.createElement(
      "div",
      { className: "auth-card" },

      React.createElement("h2", { className: "auth-title" }, "Create Account"),

      React.createElement(
        "form",
        { className: "auth-form", onSubmit: handleSignup },

        // FULL NAME
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "auth-label" }, "Full Name"),
          React.createElement("input", {
            type: "text",
            className: "auth-input",
            placeholder: "Enter your full name",
            value: fullName,
            onChange: (e) => setFullName(e.target.value),
            required: true,
          })
        ),

        // EMAIL
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "auth-label" }, "Email"),
          React.createElement("input", {
            type: "email",
            className: "auth-input",
            placeholder: "Enter your email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          })
        ),

        // ROLE SELECT (mining / shipping)
        React.createElement(
          "div",
          null,

          React.createElement("label", { className: "auth-label" }, "Role"),

          // WRAPPER SELECT
          React.createElement(
            "div",
            { className: "select-wrapper" },

            React.createElement(
              "select",
              {
                className: "auth-select",
                value: role,
                onChange: (e) => setRole(e.target.value),
                required: true,
              },

              React.createElement(
                "option",
                { value: "", disabled: true },
                "Choose Role"
              ),

              React.createElement(
                "option",
                { value: "mining" },
                "Mining Planner"
              ),

              React.createElement(
                "option",
                { value: "shipping" },
                "Shipping Planner"
              )
            )
          )
        ),


        // PASSWORD INPUT
        React.createElement(
          "div",
          { className: "input-icon-wrapper" },
          React.createElement("label", { className: "auth-label" }, "Password"),
          React.createElement("input", {
            type: showPassword ? "text" : "password",
            className: "auth-input",
            placeholder: "Choose a password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
          }),
          React.createElement("i", {
            className: showPassword
              ? "fa-solid fa-eye-slash"
              : "fa-solid fa-eye",
            onClick: () => setShowPassword(!showPassword),
            style: { zIndex: 10 },
          })
        ),


        // CONFIRM PASSWORD INPUT
        React.createElement(
          "div",
          { className: "input-icon-wrapper" },
          React.createElement("label", { className: "auth-label" }, "Confirm Password"),
          React.createElement("input", {
            type: confirmShow ? "text" : "password",
            className: "auth-input",
            placeholder: "Re-enter your password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            required: true,
          }),
          React.createElement("i", {
            className: confirmShow
              ? "fa-solid fa-eye-slash"
              : "fa-solid fa-eye",
            onClick: () => setConfirmShow(!confirmShow),
            style: { zIndex: 10 },
          })
        ),
        passwordError &&
        React.createElement(
          "p",
          { className: "auth-error-message" },
          passwordError
        ),


        // SUBMIT BUTTON
        React.createElement(
          "button",
          {
            type: "submit",
            className: "auth-btn auth-btn-green",
            disabled: loading
          },
          loading
            ? React.createElement("div", { className: "spinner-mini" })
            : "Create Account"
        )

      ),

      React.createElement(
        "p",
        { className: "auth-bottom-text" },
        "Already have an account? ",
        React.createElement("a", { href: "/login" }, "Login here")
      )
    )
  );
}
