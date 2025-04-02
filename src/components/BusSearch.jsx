import { useState, useEffect } from "react";
import { db } from "../firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";

const BusSearch = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredFrom, setFilteredFrom] = useState([]);
  const [filteredTo, setFilteredTo] = useState([]);
  const [showDropdownFrom, setShowDropdownFrom] = useState(false);
  const [showDropdownTo, setShowDropdownTo] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, "locations"));
      const locationsList = querySnapshot.docs.map((doc) => doc.data().name);
      setLocations(locationsList);
    };

    fetchLocations();
  }, []);

  const handleFromChange = (e) => {
    const input = e.target.value;
    setFrom(input);
    setFilteredFrom(
      locations.filter((loc) =>
        loc.toLowerCase().includes(input.toLowerCase())
      )
    );
    setShowDropdownFrom(true);
  };

  const handleToChange = (e) => {
    const input = e.target.value;
    setTo(input);
    setFilteredTo(
      locations.filter((loc) =>
        loc.toLowerCase().includes(input.toLowerCase())
      )
    );
    setShowDropdownTo(true);
  };

  const selectFrom = (location) => {
    setFrom(location);
    setShowDropdownFrom(false);
  };

  const selectTo = (location) => {
    setTo(location);
    setShowDropdownTo(false);
  };

  return (
    <div className="search-container">
      <div className="input-group">
        <input
          type="text"
          value={from}
          onChange={handleFromChange}
          onFocus={() => setShowDropdownFrom(true)}
          placeholder="From"
        />
        {showDropdownFrom && filteredFrom.length > 0 && (
          <ul className="dropdown">
            {filteredFrom.map((location, index) => (
              <li key={index} onClick={() => selectFrom(location)}>
                {location}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="input-group">
        <input
          type="text"
          value={to}
          onChange={handleToChange}
          onFocus={() => setShowDropdownTo(true)}
          placeholder="To"
        />
        {showDropdownTo && filteredTo.length > 0 && (
          <ul className="dropdown">
            {filteredTo.map((location, index) => (
              <li key={index} onClick={() => selectTo(location)}>
                {location}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button>Search Buses</button>
    </div>
  );
};

export default BusSearch;