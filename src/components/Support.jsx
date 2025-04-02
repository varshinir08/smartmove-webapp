import React, { useState } from "react";
import "../Support.css";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEndpoint = "https://formspree.io/f/xpwpzzbk"; // Replace with your Formspree ID

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        alert("Error submitting the form. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="support-container">
      <h2>Contact Support</h2>
      {submitted ? (
        <p className="success-message">Thank you! Your query has been submitted.</p>
      ) : (
        <form onSubmit={handleSubmit} className="support-form">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required />

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Support;
