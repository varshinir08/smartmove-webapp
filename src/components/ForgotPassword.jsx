import React, { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import "../App.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email.");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="fp-h">Reset Password</h2>
      <p className="fp-p">Enter your email and we will send you a password reset link.</p>
      <form className="fp-form" onSubmit={handleReset}>
      <label className="input-label">Email Address
        <input type="email" className="fp-ip" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <button type="submit" className="fp-bt">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
// In the above code snippet, we have created a new component named ForgotPassword. This component allows users to reset their password by sending a password reset link to their email address. The component contains a form with an input field for the user to enter their email address and a button to submit the form. When the form is submitted, the handleReset function is called, which sends a password reset email to the user's email address using the sendPasswordResetEmail function from Firebase Auth.