// src/components/Auth/Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setStatus("Creating account...");
    try {
      const response = await fetch("https://mosjf1wu16.execute-api.ap-south-1.amazonaws.com/dev/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus("Signup successful!");
        navigate("/login");
      } else {
        setStatus(result.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("Signup failed.");
    }
  };

  return (
    <div className="login-container">
      <h1>Signup</h1>

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

      <button className="transparent-btn" onClick={handleSignup}>
        Signup
      </button>

      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      {status && <div className="status-text">{status}</div>}
    </div>
  );
};

export default Signup;
