import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import BusTracking from "./BusTracking.jsx";
import { useAuth } from "../components/AuthContext"; 
import VoiceSearch from "../components/VoiceSearch";
import { updateDoc, arrayUnion } from "firebase/firestore";
import Header from "../components/Header";
const Home = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [search, setSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  const navigate = useNavigate();
  const { user } = useAuth(); // Get logged-in user info
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode");
  };
  const handleVoiceSearch = (from, to) => {
    console.log("Voice Query Extracted - From:", from, "To:", to);
    setFrom(from);
    setTo(to);
    setTimeout(() => {
      console.log("Running search after state update...");
      handleSearch(from, to);
    }, 100);
  };
  
  
  const handleSelectFirstBus = () => {
    if (filteredBuses.length > 0) {
      const firstBus = filteredBuses[0]; // Select the first available bus
      console.log("Automatically selecting bus:", firstBus.name || "Unnamed Bus");
      navigate(`/seat-availability/${firstBus.id}`, { state: { bus: firstBus } });
    } else {
      alert("No available buses to select.");
    }
  };

  // Fetch buses
  useEffect(() => {
    if (user) {
      const checkAdminStatus = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          console.log("User data from Firestore:", userSnap.data());
          setIsAdmin(userSnap.data().isAdmin); // Ensure isAdmin exists in Firestore
        }
      };
  
      checkAdminStatus();
    }
  }, [user]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "buses"), (snapshot) => {
      const busData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), 
        
      }));
      setBuses(busData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user role (admin or not)
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin || false);
        }
      }
    };

    fetchUserRole();
  }, [user]);
  
//for making the from field as array
  /*const handleSearch = (searchFrom = from, searchTo = to) => {
    console.log("Searching for buses from:", searchFrom, "to:", searchTo);
  
    if (!searchFrom.trim() || !searchTo.trim()) {
      setFilteredBuses([]);
      setSearch(false);
      return;
    }
  
    const fromLower = searchFrom.trim().toLowerCase();
    const toLower = searchTo.trim().toLowerCase();
  
    const filtered = buses.filter((bus) => {
      const busFrom = bus.from?.toLowerCase();
      const matchesTo = Array.isArray(bus.to)
        ? bus.to.some((destination) => destination.toLowerCase() === toLower)
        : bus.to?.toLowerCase() === toLower;
  
      return busFrom === fromLower && matchesTo;
    });
  
    console.log("Filtered buses:", filtered);
    setFilteredBuses(filtered);
    setSearch(true);
  };
  */
  const handleSearch = (searchFrom = from, searchTo = to) => {
    console.log("Searching for buses from:", searchFrom, "to:", searchTo);
  
    if (!searchFrom.trim() || !searchTo.trim()) {
      setFilteredBuses([]);
      setSearch(false);
      return;
    }
  
    const fromLower = searchFrom.trim().toLowerCase();
    const toLower = searchTo.trim().toLowerCase();
  
    const filtered = buses.filter((bus) => {
      const matchesFrom = Array.isArray(bus.from)
        ? bus.from.some((start) => start.toLowerCase() === fromLower)
        : bus.from?.toLowerCase() === fromLower;
  
      const matchesTo = Array.isArray(bus.to)
        ? bus.to.some((destination) => destination.toLowerCase() === toLower)
        : bus.to?.toLowerCase() === toLower;
  
      return matchesFrom && matchesTo;
    });
  
    console.log("Filtered buses:", filtered);
    setFilteredBuses(filtered);
    setSearch(true);
  };
  useEffect(() => {
    if (buses.length > 0) {
      console.log("Buses fetched:", buses);
    } else {
      console.log("No buses loaded yet!");
    }
  }, [buses]);
  


  const handleSelectBus = async (bus) => {
    if (!user) return;
    sessionStorage.setItem("selectedBus", JSON.stringify(bus));
    const busRef = doc(db, "buses", bus.id);
  
    try {
      await updateDoc(busRef, {
        passengers: arrayUnion({ uid: user.uid, from, to }), // Store user's journey
      });
  
      navigate(`/seat-availability/${bus.id}`, { state: { bus } });
    } catch (error) {
      console.error("Error saving user journey:", error);
    }
  };
  
  const handleSeatUpdate = () => {
    navigate("/seat-update");
  };
  console.log("isAdmin:", isAdmin);
  console.log("user:", user);
  return (
    <div className={`home-container ${isDarkMode ? "dark-mode" : ""}`}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
    <div style={{ textAlign: "center", padding: "20px" }} className="h-div">
      <h1 className="h-h1">Find Your Bus</h1>
      <label className="h-lb1">Boarding Point</label><br/>
      <input
        type="text"
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }} className="h-ip"
      />
      <label className="h-lb2">Destination</label>
      <input
        type="text"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ padding: "8px" }} className="h-ip"
      />
      <VoiceSearch onSearch={handleVoiceSearch} onSelectFirstBus={handleSelectFirstBus} />  {/* 🎤 Add Voice Search Here */}
      <button onClick={() => handleSearch()}  className="sb-btn">
  Search Buses
</button>
      {isAdmin ? <button onClick={handleSeatUpdate} className="su-btn">Seat Update</button> : null}
      {search && (
        <>
          <h2 className="h-h2">Available Buses</h2>
          {filteredBuses.length === 0 ? (
            <p className="h-p">No buses available for this route.</p>
          ) : (
            <ul className="bus-list">
  {filteredBuses.map((bus) => (
    <li key={bus.id} className="bus-card">
      <strong className="bus-name">{bus.name || "Unnamed Bus"}</strong> <br />
      <span className="bus-route">Route: {bus.from} → {Array.isArray(bus.to) ? bus.to.join(", ") : bus.to}</span> <br />
      <span className="bus-seats">Seats Available: {bus.availableSeats ?? "Unknown"}</span> <br />
      <button onClick={() => handleSelectBus(bus)} className="select-bus-btn">
        Select Bus
      </button>
    </li>
  ))}
</ul>

          )}
        </>
      )}

   


      {search && <BusTracking buses={filteredBuses} />}
      </div>
    </div>
  );
};

export default Home;
