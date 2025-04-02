import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, MicOff } from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {onSnapshot } from "firebase/firestore";


const SeatAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Retrieve bus from sessionStorage if it's missing from location.state
  const storedBus = JSON.parse(sessionStorage.getItem("selectedBus"));
  const bus = location.state?.bus || storedBus;

  const [availableSeats, setAvailableSeats] = useState(40);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [seatedSeats, setSeatedSeats] = useState(new Set());
  const [showPrompt, setShowPrompt] = useState(false); 
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [listening, setListening] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState(null);
   // Store passengers list
  const [nextAvailableSeats, setNextAvailableSeats] = useState(0);
  const [stopsUntilFree, setStopsUntilFree] = useState(0);
  let recognition = null;

  /*useEffect(() => {
    const fetchSeats = async () => {
      if (bus?.id) {
        const busRef = doc(db, "buses", bus.id);
        const busSnap = await getDoc(busRef);
        if (busSnap.exists()) {
          const data = busSnap.data();
          setAvailableSeats(data.availableSeats);
          const totalSeats = 40;
          const reserved = new Set();
          while (reserved.size < totalSeats - data.availableSeats) {
            reserved.add(Math.floor(Math.random() * totalSeats) + 1);
          }
          setReservedSeats([...reserved]);
        }
      }
    };
    fetchSeats();
  }, [bus]);*/

  useEffect(() => { 
    const fetchSeats = async () => {
      if (bus?.id) {
        const busRef = doc(db, "buses", bus.id);
        const busSnap = await getDoc(busRef);
        if (busSnap.exists()) {
          const data = busSnap.data();
          setAvailableSeats(data.availableSeats);
          
          const totalSeats = 40;
          let storedSeats = sessionStorage.getItem(`reservedSeats_${bus.id}`);
  
          if (storedSeats) {
            // 🔹 Use previously stored reserved seats
            setReservedSeats(JSON.parse(storedSeats));
          } else {
            // 🔹 Generate new random reserved seats (only first time)
            const reserved = new Set();
            while (reserved.size < totalSeats - data.availableSeats) {
              reserved.add(Math.floor(Math.random() * totalSeats) + 1);
            }
            
            const reservedArray = [...reserved];
            sessionStorage.setItem(`reservedSeats_${bus.id}`, JSON.stringify(reservedArray)); // 🔹 Store in session
            setReservedSeats(reservedArray);
          }
        }
      }
    };
    fetchSeats();
  }, [bus]); 
  

  const updateSeatInFirestore = async (busId, newAvailableSeats) => {
    if (!busId) return;
    try {
      const busRef = doc(db, "buses", busId); // Ensure the collection name is correct
      await updateDoc(busRef, {
        availableSeats: newAvailableSeats,
      });
      console.log("Seat availability updated in Firestore.");
    } catch (error) {
      console.error("Error updating seat availability:", error);
    }
  };
  const handleSeatClick = async (seatNumber) => {
    if (seatedSeats.has(seatNumber)) {
      setSelectedSeat(seatNumber);
      setShowPrompt(true);
    } else {
      handleSeatUpdate(seatNumber, false);
    }
  };
  const handleConfirmation = (confirmation) => {
    if (confirmation) {
      setSeatedSeats((prev) => {
        const updated = new Set(prev);
        updated.delete(selectedSeat);
        return updated;
      });
  
      setAvailableSeats((prev) => prev + 1);
  
      updateSeatInFirestore(availableSeats + 1);
  
      setShowPrompt(false);
  
      // Delay navigation slightly to ensure state updates
      setTimeout(() => {
        navigate("/thank-you");
      }, 500);
    } else {
      setShowPrompt(false);
    }
  };
  

  const handleSeatUpdate = async (seatNumber, isSeated) => {
    if (bus?.id) {
      const busRef = doc(db, "buses", bus.id);
      if (isSeated) {
        setSeatedSeats((prev) => {
          const updated = new Set(prev);
          updated.delete(seatNumber);
          return updated;
        });
        setAvailableSeats((prev) => prev + 1);
        await updateDoc(busRef, { availableSeats: availableSeats + 1 });
      } else {
        setSeatedSeats((prev) => new Set(prev).add(seatNumber));
        setAvailableSeats((prev) => prev - 1);
        await updateDoc(busRef, { availableSeats: availableSeats - 1 });
      }
    }
  };
 
  const findNextAvailableSeats = (passengers, route) => {
    if (!passengers.length || !route.length) {
      setNextAvailableSeats(0);
      setStopsUntilFree(0);
      return;
    }
  
    const normalizedRoute = route.map(stop => stop.toLowerCase());
    let soonestStopIndex = route.length; // Assume no stops
    let usersGettingDown = 0; // ✅ Declare the variable before using it
  
    passengers.forEach(passenger => {
      const passengerToLower = passenger.to.toLowerCase();
      const stopIndex = normalizedRoute.indexOf(passengerToLower);
  
      if (stopIndex !== -1 && stopIndex < soonestStopIndex) {
        soonestStopIndex = stopIndex;
      }
    });
  
    if (soonestStopIndex !== route.length) {
      usersGettingDown = passengers.filter(p => p.to.toLowerCase() === normalizedRoute[soonestStopIndex]).length;
    }
  
    setNextAvailableSeats(usersGettingDown);
    setStopsUntilFree(soonestStopIndex);
  
    console.log("Next stop index:", soonestStopIndex, "Users getting down:", usersGettingDown);
  };
  
  useEffect(() => {
    if (!bus?.id) return;
  
    const busRef = doc(db, "buses", bus.id);
    const unsubscribe = onSnapshot(busRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Updated Firestore passengers:", JSON.stringify(data.passengers, null, 2));
        console.log("Route:", JSON.stringify(data.route, null, 2));
        
        findNextAvailableSeats(data.passengers || [], data.route || []);
      }
    });
  
    return () => unsubscribe();
  }, [bus]);
  
  
  // Function to fetch destination coordinates
  const fetchDestinationCoords = async () => {
    if (!bus?.to) return;
  
    const apiKey = "AIzaSyDyI9ViQTMTFlsmkiD6eLiYzcPGSek2a6E"; // Your Google Maps API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(bus.to)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setDestinationCoords(location);
      } else {
        console.error("Failed to fetch destination coordinates:", data.status);
      }
    } catch (error) {
      console.error("Error fetching destination coordinates:", error);
    }
  };
  
  useEffect(() => {
    fetchDestinationCoords();
  }, [bus?.to]);
  const haversineDistance = (coords1, coords2) => {
    const toRad = (angle) => (Math.PI / 180) * angle;
    
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLng = toRad(coords2.lng - coords1.lng);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords1.lat)) *
        Math.cos(toRad(coords2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  
  useEffect(() => {
    if (!destinationCoords) return;
  
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
  
        const distance = haversineDistance(userCoords, destinationCoords);
  
        if (distance < 0.1) {
          handleSeatUpdate([...seatedSeats][0], true); // Mark the user as getting down
          navigator.geolocation.clearWatch(watchId);
        }
      },
      (error) => console.error("Error getting user location:", error),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  
    return () => navigator.geolocation.clearWatch(watchId);
  }, [destinationCoords, seatedSeats]); // ✅ Add seatedSeats to dependencies
  
  const toggleVoiceRecognition = () => {
    if (listening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      if (transcript.includes("i have seated")) {
        updateSeatStatus("seated");
      } else if (transcript.includes("i am getting down")) {
        updateSeatStatus("gettingDown");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    setListening(true);
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
    setListening(false);
  };

  const updateSeatStatus = (action) => {
    if (action === "seated" && availableSeats > 0) {
      handleSeatUpdate([...reservedSeats].find(seat => !seatedSeats.has(seat)), false);
    } else if (action === "gettingDown" && seatedSeats.size > 0) {
      handleSeatUpdate([...seatedSeats][0], true);
    }
  };
  const handlePayment = () => {
    navigate("/payment", { state: { bus } });
  };
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color:"#091292"}}>Seat Availability</h1>
      <div className="route-box">
      <h2>{bus?.from} ↔ {Array.isArray(bus.to) ? bus.to.join(", ") : bus.to}</h2>
      </div>
      <h3 style={{ color:"#091292"}}>{bus?.name}</h3>
      <p style={{ fontWeight: "bold", fontSize: "18px", color:"#091292" }}>{availableSeats} Seats left</p>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <div style={{ background: "#FFF", padding: "20px", borderRadius: "10px" }}>
          {[...Array(10)].map((_, rowIndex) => (
            <div key={rowIndex} style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
              {[1, 2, 3, 4].map((offset) => {
                const index = rowIndex * 4 + offset;
                const isReserved = reservedSeats.includes(index);
                const isSeated = seatedSeats.has(index);
                return (
                  <div
                    key={index}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "5px",
                      backgroundColor: isSeated ? "#7A95D2" : isReserved ? "#ff8b94" : "#94D179",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#fff",
                      cursor: isReserved ? "not-allowed" : "pointer",
                      margin: "5px",
                    }}
                    title={isSeated ? "Seat Confirmed" : isReserved ? "Seat Booked" : "Available"}
                    onClick={() => handleSeatClick(index)}
                  >
                    {index}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontWeight: "bold", fontSize: "16px", color: "black" }}>
  {availableSeats === 0 || nextAvailableSeats > 0 
    ? `${nextAvailableSeats} seats will be available in ${stopsUntilFree} stops`
    :"No seats available at the next stop" }
</p>
      {showPrompt && (
        <div className="confirmation-box">
          <p>Are you getting down?</p>
          <button onClick={() => handleConfirmation(true)}>Yes</button>
          <button onClick={() => handleConfirmation(false)}>No</button>
        </div>
      )}
      <button onClick={toggleVoiceRecognition} style={{ position: "fixed", bottom: "20px", left: "20px", backgroundColor: listening ? "#f54242" : "#091292", color: "#fff", border: "none", borderRadius: "50%", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        {listening ? <Mic size={24} /> : <MicOff size={24} />}
      </button>
      <button onClick={handlePayment} className="pay-btn">Pay Now</button>

    </div>
  );
};

export default SeatAvailability;