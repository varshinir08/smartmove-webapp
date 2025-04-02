import { useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as needed

const LiveTracking = ({ bus, destinationCoords }) => {
  const updateSeatOnArrival = async () => {
    if (!bus?.id || !destinationCoords) return;

    try {
      const busRef = doc(db, "buses", bus.id);
      const busSnap = await getDoc(busRef);

      if (busSnap.exists()) {
        const currentSeats = busSnap.data().availableSeats;
        await updateDoc(busRef, { availableSeats: currentSeats + 1 });
        console.log("Seat availability updated: User reached destination.");
      }
    } catch (error) {
      console.error("Error updating seat availability:", error);
    }
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
          updateSeatOnArrival();
          navigator.geolocation.clearWatch(watchId); // Stop tracking
        }
      },
      (error) => console.error("Error getting user location:", error),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [destinationCoords]);

  const haversineDistance = (coords1, coords2) => {
    const R = 6371; // Earth radius in km
    const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180);
    const dLon = (coords2.lng - coords1.lng) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coords1.lat * (Math.PI / 180)) *
        Math.cos(coords2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  return null; // No UI needed, just background tracking
};

export default LiveTracking;
