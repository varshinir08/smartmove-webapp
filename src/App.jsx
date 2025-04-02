import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import UserRegister from "./components/UserRegister";
import AdminRegister from "./components/AdminRegister";
import Home from "./components/Home";
import SeatAvailability from "./components/SeatAvailability";
import SeatBooking from "./components/SeatBooking";
import SeatUpdate from "./components/SeatUpdate";
import Payment from "./components/Payment";
import Support from "./components/Support"; 
import ThankYou from "./components/ThankYou";
import SmartMoveAbout from "./components/SmartMoveAbout";
import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register-user" element={<UserRegister />} />
        <Route path="/register-admin" element={<AdminRegister />} />
        <Route path="/home" element={<Home />} />
        <Route path="/seat-availability/:busId" element={<SeatAvailability/>}/>
        <Route path="/seat-booking" element={<SeatBooking />} />
        <Route path="/seat-update" element={<SeatUpdate />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<SmartMoveAbout />} />

      </Routes>
    </Router>
  );
}

export default App;
