import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {FaUser, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import "./Header.css"; // Add styles for header
import logo from "../smartmove_logo.png";

const Header = ({ toggleDarkMode, isDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
      <img src={logo} alt="SmartMove Logo" className="smartmove_logo" /><span>SmartMove</span>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/support">Support</Link>
        {user?.isAdmin && <Link to="/seat-update">Seat Update</Link>}
      </nav>
      <div className="right-section">
        <button onClick={toggleDarkMode} className="theme-toggle">
          {isDarkMode ? <FaSun size={20} title="theme" /> : <FaMoon size={20} title="theme" />}
        </button>
        <div className="user-profile">
          <FaUser size={20} />
          <span>{user?.displayName || "Guest"}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt size={20} title="logout"/>
        </button>
      </div>
    </header>
  );
};

export default Header;
