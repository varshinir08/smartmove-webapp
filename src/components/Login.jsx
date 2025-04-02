import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-h2">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label className="login-l"><b>Email Address</b> 
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="login-ip" /></label><br/>
        <label className="login-l2"><b>Password</b>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="login-ip" /></label><br/>
        <button type="submit" className="login-btn">Login</button>
      </form>
      <p onClick={() => navigate("/forgot-password")} className="link1">Forgot Password?</p>
      <p className="">New To SmartMove?</p>
      <p onClick={() => navigate("/register-user")} className="link">Create User Account</p>
      <p onClick={() => navigate("/register-admin")} className="link">Create Admin Account</p>
    </div>
  );
};

export default Login;