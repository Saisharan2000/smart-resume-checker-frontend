// src/components/Auth/Login.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setStatus("Logging in...");
    try {
      const response = await fetch("https://mosjf1wu16.execute-api.ap-south-1.amazonaws.com/dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        login(email);
        setStatus("Login successful!");
        navigate("/upload");
      } else {
        setStatus(result.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <input
        className="input-field"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="transparent-btn" onClick={handleLogin}>
        Login
      </button>

      <p style={{ marginTop: "1rem" }}>
        Don’t have an account? <Link to="/signup">Signup</Link>
      </p>

      {status && <div className="status-text">{status}</div>}
    </div>
  );
};

export default Login;
