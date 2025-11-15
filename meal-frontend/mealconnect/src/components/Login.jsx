import React, { useState } from "react";

export default function Login({ onLogin, onRoute }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    pin: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "pin") {
      value = value.replace(/\D/g, "").slice(0, 4); // Only digits, max 4
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="pin"
            placeholder="4-digit PIN"
            value={formData.pin}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:8}}>
          <p className="forgot-pin" style={{cursor:'pointer',color:'#007bff',margin:0}} onClick={() => onRoute && onRoute('forgot')}>Forgot PIN?</p>
        </div>
        <p onClick={() => setIsSignup(!isSignup)} className="toggle-text">
          {isSignup
            ? "Already have an account? Login"
            : "New here? Sign Up"}
        </p>
      </div>
    </div>
  );
}