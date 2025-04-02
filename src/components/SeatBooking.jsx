/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const SeatBooking = () => {
  const location = useLocation();
  const bus = location.state?.bus || {};
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          updateBusLocation(position.coords.latitude, position.coords.longitude);
        },
        (err) => setError("Location access denied. Enable GPS to update."),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported on this device.");
    }
  }, []);

  const updateBusLocation = async (lat, lng) => {
    if (!bus.id) return;

    try {
      const busRef = doc(db, "buses", bus.id);
      await updateDoc(busRef, {
        latitude: lat,
        longitude: lng,
        lastUpdated: serverTimestamp(),
      });
      console.log(`Updated location for ${bus.name}: ${lat}, ${lng}`);
    } catch (err) {
      console.error("Error updating bus location:", err);
      setError("Failed to update location.");
    }
  };

  return (
    <div>
      <h2>Seat Booking for {bus.name}</h2>
      <p>Route: {bus.from} → {bus.to}</p>
      <p>Seats Available: {bus.availableSeats}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SeatBooking;