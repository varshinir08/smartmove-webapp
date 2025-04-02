import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../App.css";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user" // Assign role
      });

      navigate("/home"); // Redirect after registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="user-register">
      <h2 className="ur-h">User Registration</h2>
      <form onSubmit={handleRegister} className="ur-form">
        {error && <p className="error">{error}</p>}
        <label className="ur-lb1">Email Address</label>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="ur-ip" /> <br/>
        <label className="ur-lb2">Password</label>        
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="ur-ip"/>
        <button type="submit" className="ur-btn">Register</button>
      </form>
      <p onClick={() => navigate("/login")} className="link">Back to Login</p>
    </div>
  );
};

export default UserRegister;
