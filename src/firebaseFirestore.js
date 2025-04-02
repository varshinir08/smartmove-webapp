import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Fetch seat data
export const fetchSeatData = async (busId) => {
  try {
    const busRef = doc(db, "buses", busId);
    const docSnap = await getDoc(busRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching seat data:", error);
    return null;
  }
};
export const updateSeatAvailability = async (busId, seatNumber, isAvailable) => {
  try {
    const busRef = doc(db, "buses", busId); // Assuming you're storing bus data in a collection called "buses"
    
    // Update the seat availability for the specific bus
    await updateDoc(busRef, {
      [`seats.${seatNumber}`]: isAvailable ? "available" : "booked", // Update the seat status
    });

    console.log(`Seat ${seatNumber} updated to ${isAvailable ? "available" : "booked"}`);
  } catch (error) {
    console.error("Error updating seat availability: ", error);
  }
};

// Update available seats count
export const updateAvailableSeats = async (busId, change) => {
  try {
    const busRef = doc(db, "buses", busId);
    const docSnap = await getDoc(busRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const newAvailableSeats = Math.max(0, data.availableSeats + change);
    await updateDoc(busRef, { availableSeats: newAvailableSeats });

    console.log(`Updated availableSeats: ${newAvailableSeats}`);
  } catch (error) {
    console.error("Error updating available seats:", error);
  }
  
};