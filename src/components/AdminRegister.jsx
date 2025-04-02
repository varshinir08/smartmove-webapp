import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../App.css";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store admin role in Firestore with isAdmin: true
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        isAdmin: true // ✅ Ensure admin status is set
      });

      console.log("Admin registered successfully:", user.email);

      navigate("/home"); // Redirect to home page after registration
    } catch (error) {
      setError(error.message);
      console.error("Error registering admin:", error);
    }
  };

  return (
    <div className="admin-register">
      <h2 className="ar-h">Admin Registration</h2>
      <form onSubmit={handleRegister} className="ar-form">
        {error && <p className="error">{error}</p>}
        <label className="ar-lb1">Email Address</label>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="ar-ip" 
        />
        <br/>
        <label className="ar-lb2">Password</label> 
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="ar-ip" 
        />
        <br/>
        <button type="submit" className="ar-btn">Register</button>
      </form>
      <p onClick={() => navigate("/login")} className="ar-link">Back to Login</p>
    </div>
  );
};

export default AdminRegister;
