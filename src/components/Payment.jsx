import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Payment.css";
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bus = location.state?.bus;
  const [fare, setFare] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchFare = async () => {
      if (bus?.id) {
        try {
          const busRef = doc(db, "buses", bus.id);
          const busSnap = await getDoc(busRef);
          if (busSnap.exists()) {
            setFare(busSnap.data().fare);
          } else {
            console.error("Bus data not found!");
          }
        } catch (error) {
          console.error("Error fetching bus fare:", error);
        }
      }
    };
    fetchFare();
  }, [bus]);

  const initiatePayment = () => {
    if (!fare) {
      alert("Bus fare not available!");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    setProcessing(true);

    const options = {
      key: "rzp_test_RUlfU2sYGSUNJ4", // Replace with your Razorpay Test Key
      amount: fare * 100, // Convert to paisa
      currency: "INR",
      name: "SmartMove",
      description: `Ticket for ${bus.name}`,
      handler: async (response) => {
        try {
          const ticketData = {
            busName: bus.name,
            from: bus.from,
            to: bus.to,
            amountPaid: fare,
            paymentId: response.razorpay_payment_id,
            timestamp: new Date(),
          };

          const ticketRef = doc(db, "tickets", response.razorpay_payment_id);
          await setDoc(ticketRef, ticketData);

          setTicket(ticketData);
        } catch (error) {
          console.error("Error saving ticket:", error);
        } finally {
          setProcessing(false);
        }
      },
      theme: { color: "#3399cc" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // 🔹 Fake Payment Success for Testing (Remove this in Production)
 /* const fakePaymentSuccess = async () => {
    setProcessing(true);
    setTimeout(async () => {
      const fakeResponse = {
        razorpay_payment_id: `TEST_${Math.random().toString(36).substr(2, 9)}`,
      };

      const ticketData = {
        busName: bus.name,
        from: bus.from,
        to: bus.to,
        amountPaid: fare,
        paymentId: fakeResponse.razorpay_payment_id,
        timestamp: new Date(),
      };

      await setDoc(doc(db, "tickets", fakeResponse.razorpay_payment_id), ticketData);
      setTicket(ticketData);
      setProcessing(false);
    }, 2000);
  };*/

  return (
    <div className="payment-container">
      <h1 style={{ color:"#091292"}}>Payment</h1>
      <h2 style={{ color:"black"}}>Bus: {bus?.name}</h2>
      <p style={{ color:"black"}}>Route: {bus?.from} → {Array.isArray(bus.to) ? bus.to.join(", ") : bus.to}</p>

      {fare !== null ? (
        <>
          <h3 style={{ color:"green"}}>Fare: ₹{fare}</h3>
          {!ticket ? (
            <div>
              <button className="pay-btn" onClick={initiatePayment} disabled={processing}>
                {processing ? "Processing Payment..." : "Pay Now"}
              </button>
            </div>
          ) : (
            <div className="ticket-box">
              <div className="ticket-header">🎟 Ticket Confirmed</div>
              <div className="ticket-content">
                <p><strong>Bus:</strong> {ticket.busName}</p>
                <p><strong>From:</strong> {ticket.from}</p>
                <p><strong>To:</strong> {Array.isArray(bus.to) ? bus.to.join(", ") : bus.to}</p>
                <p><strong>Amount Paid:</strong> ₹{ticket.amountPaid}</p>
                <p><strong>Payment ID:</strong> {ticket.paymentId}</p>
              </div>
              <button className="finish-btn" onClick={() => navigate("/thank-you")}>
                Finish
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading fare...</p>
      )}
    </div>
  );
};

export default Payment;
