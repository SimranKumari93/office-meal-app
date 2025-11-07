import React, { useState } from "react";

/* Login handles both sign in and sign up (UI). Replace the submit handlers with API calls. */
export default function Login({ onLogin, onRoute }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [form, setForm] = useState({ name: "", employee_id: "", password: "" });

  function handleChange(e) {
    setForm({...form, [e.target.name]: e.target.value});
  }

  function submit(e) {
    e.preventDefault();
    // Dummy auth: on signup return employee with role employee. Replace with real API.
    const user = {
      employee_id: form.employee_id || "E001",
      name: form.name || "Riya Sharma",
      role: form.employee_id === "admin" ? "admin" : "employee",
    };
    if (onLogin) onLogin(user);
  }

  return (
    <div className="page-wrapper">
      <div className="card auth-card">
        <h2 className="auth-title">{mode==="signin" ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <input name="name" className="input" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          )}
          <input name="employee_id" className="input" placeholder="Employee ID" value={form.employee_id} onChange={handleChange} required />
          {mode === "signup" && <input name="email" className="input" placeholder="Email (optional)" />}
          <input name="password" type="password" className="input" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="btn" type="submit">{mode==="signin" ? "Sign In" : "Create Account"}</button>
        </form>
        <p className="switch-text">
          {mode==="signin" ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span onClick={()=>setMode(mode==="signin" ? "signup" : "signin")}>{mode==="signin" ? "Sign up" : "Sign in"}</span>
        </p>
      </div>
    </div>
  );
}
