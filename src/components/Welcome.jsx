import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import busImage from "../first_bus.png";
import logo from "../smartmove_logo.png";
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <h1>Welcome to SmartMove</h1> 
      <h2><i>_._Seamless Travel, Smarter Routes_._</i></h2>
      <img src={logo} alt="SmartMove Logo" className="smartmove_logo" />
      <p>An web app for convenient bus seat booking schedules, payments, and travel updates in Chennai.</p>   
      <button onClick={() => navigate("/login")} className="btn">Get Started</button>
      <img src={busImage} alt="Bus" className="bus-animation" />
    </div>
  );
};

export default Welcome;
