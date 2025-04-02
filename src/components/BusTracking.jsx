import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 13.0827, // Default to Chennai
  lng: 80.2707,
};

const BusTracking = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDyI9ViQTMTFlsmkiD6eLiYzcPGSek2a6E",
  });

  const [userLocation, setUserLocation] = useState(null);
  const [buses, setBuses] = useState([]);

  // Get User's Current Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch buses from Firestore & sort by highest available seats
  useEffect(() => {
    const busRef = collection(db, "buses");
    const busQuery = query(busRef, orderBy("availableSeats", "desc")); // Sort by available seats

    const unsubscribe = onSnapshot(busQuery, (snapshot) => {
      const busesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBuses(busesData);
    });

    return () => unsubscribe();
  }, []);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={userLocation || defaultCenter} zoom={15}>
      {/* User's Current Location Marker */}
      {userLocation && <Marker position={userLocation} icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"} />}

      {/* Bus Location Markers */}
      {buses.map((bus) => (
        <Marker key={bus.id} position={{ lat: bus.latitude, lng: bus.longitude }} label={bus.availableSeats.toString()} />
      ))}
    </GoogleMap>
  );
};

export default BusTracking;