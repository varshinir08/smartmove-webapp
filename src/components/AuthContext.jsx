import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // ✅ Ensure Firebase auth is correctly imported
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
const AuthContext = createContext(); // ✅ Create Auth Context

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  const logout = async () => {
    try {
      await signOut(auth); // Firebase sign-out function
      setUser(null); // Clear user state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export useAuth for accessing auth state
export const useAuth = () => {
  return useContext(AuthContext);
};
