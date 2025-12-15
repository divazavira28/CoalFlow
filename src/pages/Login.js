import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);



  const navigate = useNavigate();

  // ===========================
  // LOAD SAVED EMAIL (Remember Me)
  // ===========================
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ===========================
  // LOGIN HANDLER
  // ===========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMsg("Sorry, your email or password was incorrect.");
        setLoading(false);
        return;
      }



      // SIMPAN TOKEN + UID
      localStorage.setItem("idToken", result.idToken);
      localStorage.setItem("uid", result.uid);

      // Delay supaya token validated dulu
await new Promise(r => setTimeout(r, 800));

      // SAVE EMAIL IF REMEMBER ME CHECKED
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // AMBIL ROLE USER
      const roleResp = await fetch("http://127.0.0.1:8000/me", {
        headers: { Authorization: `Bearer ${result.idToken}` },
      });

      const roleJson = await roleResp.json();
      if (!roleResp.ok) {
        alert("Gagal mengambil role user");
        return;
      }

      localStorage.setItem("role", roleJson.role);

      setLoading(false);


      // REDIRECT SESUAI ROLE
      if (roleJson.role === "mining") {
        navigate("/dashboard/mining");
      } else if (roleJson.role === "shipping") {
        navigate("/dashboard/shipping");
      } else {
        navigate("/unauthorized");
      }

    } catch (err) {
      console.log("Login Error:", err);
      setErrorMsg("Server error. Please try again.");
    }

  };

  return React.createElement(
    "div",
    { className: "auth-wrapper" },

    React.createElement(
      "div",
      { className: "auth-card" },

      React.createElement("h2", { className: "auth-title" }, "Login"),

      React.createElement(
        "form",
        { className: "auth-form", onSubmit: handleLogin },

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

        // PASSWORD
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "auth-label" }, "Password"),

          React.createElement(
            "div",
            { className: "password-field" },

            React.createElement("input", {
              type: showPassword ? "text" : "password",
              className: "auth-input",
              placeholder: "Enter your password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true,
            }),

            React.createElement("i", {
              className: showPassword
                ? "fa-solid fa-eye-slash"
                : "fa-solid fa-eye",
              onClick: () => setShowPassword(!showPassword),
            })
          )
        ),

        // REMEMBER ME ROW
        React.createElement(
          "div",
          { className: "remember-row" },
          React.createElement("input", {
            type: "checkbox",
            id: "rememberMe",
            className: "remember-checkbox",
            checked: rememberMe,
            onChange: () => setRememberMe(!rememberMe),
          }),
          React.createElement(
            "label",
            { htmlFor: "rememberMe", className: "remember-label" },
            "Remember Me"
          )
        ),

        // ERROR MESSAGE (SHOW BELOW INPUTS)
        errorMsg &&
        React.createElement(
          "p",
          { className: "auth-error-message" },
          errorMsg
        ),


        // BUTTON LOGIN
        React.createElement(
          "button",
          {
            type: "submit",
            className: "auth-btn",
            disabled: loading
          },
          loading
            ? React.createElement("div", { className: "spinner-mini" })
            : "Login"
        )

      ),

      React.createElement(
        "p",
        { className: "auth-bottom-text" },
        "Belum punya akun? ",
        React.createElement("a", { href: "/signup" }, "Daftar di sini")
      )
    )
  );
}
