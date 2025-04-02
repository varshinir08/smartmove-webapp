import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";

const SeatUpdate = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableSeats, setAvailableSeats] = useState("");

  // Fetch all buses from Firestore
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const busesSnapshot = await getDocs(collection(db, "buses"));
        const busesList = busesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBuses(busesList);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchBuses();
  }, []);

  const handleUpdateSeats = async () => {
    if (!selectedBus || availableSeats === "") {
      alert("Please select a bus and enter available seats.");
      return;
    }

    const availableSeatsInt = parseInt(availableSeats, 10);
    if (isNaN(availableSeatsInt) || availableSeatsInt < 0) {
      alert("Invalid seat number.");
      return;
    }

    console.log(`Updating bus ${selectedBus.id} with available seats:`, availableSeatsInt);

    try {
      await updateDoc(doc(db, "buses", selectedBus.id), {
        availableSeats: availableSeatsInt,
      });

      // Update UI instantly
      setSelectedBus((prev) => ({ ...prev, availableSeats: availableSeatsInt }));

      alert("Seats updated successfully!");
    } catch (error) {
      console.error("Error updating seats:", error);
      alert("Failed to update seats.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="ua-h1">Update Available Seats</h1>

      {/* Dropdown for selecting a bus */}
      <select className="ua-select"
        value={selectedBus?.id || ""}
        onChange={(e) => {
          const bus = buses.find((bus) => bus.id === e.target.value);
          setSelectedBus(bus);
          setAvailableSeats(bus?.availableSeats || "");
        }}
        style={{ padding: "8px", marginBottom: "10px" }}
      >
        <option className="ua-op" value="">Select a Bus</option>
        {buses.map((bus) => (
          <option key={bus.id} value={bus.id}>
            {bus.name} ({bus.availableSeats} seats)
          </option>
        ))}
      </select>

      {/* Seat update input */}
      {selectedBus && (
        <div>
          <h2>{selectedBus.name}</h2>
          <p>Available Seats: {selectedBus.availableSeats}</p>

          <input
            type="number"
            placeholder="Enter new available seats"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <button onClick={handleUpdateSeats} style={{ padding: "8px" }}>
            Update Seats
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatUpdate;