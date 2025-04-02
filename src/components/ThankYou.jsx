import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; 
const ThankYou = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth(); // 🔹 Get logout function

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = {
      name,
      email,
      rating,
      comments,
    };

    try {
      await fetch("https://formspree.io/f/xpwpzzbk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
      alert("Feedback submitted successfully!");
      setName("");
      setEmail("");
      setRating(5);
      setComments("");
    } catch  {
      alert("Error submitting feedback. Please try again.");
    }
  };
  const handleLogout = async () => {
    try {
      await logout(); // 🔹 Logs out the user
      navigate("/"); // 🔹 Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="thank-you-container">
      <h2>Thank You for Using SmartMove</h2>
      <video autoPlay loop muted className="thank-you-video">
        <source src="/thank_you.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="feedback-form">
        <h3>We value your feedback!</h3>
        <form onSubmit={handleSubmit} className="t-form">
          <label className="t-lb1">
            Name:
            <input className="t-ip"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="t-lb2">
            Email:
            <input className="t-ip"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="t-lb3">
            Rating:
            <input className="t-ip"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </label>
          <label className="t-lb4">
            Comments:
            <textarea className="t-tx"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
            ></textarea>
          </label>
          <button type="submit" className="t-btn">Submit Feedback</button>
        </form>
      </div>
      <p onClick={() => navigate("/")} className="ar-link">Go Home</p>
      <button onClick={handleLogout} className="logout_btn">Logout</button>
    </div>
  );
};

export default ThankYou;