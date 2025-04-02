import { getAuth, onAuthStateChanged } from "firebase/auth";

export const fetchUserDetails = (setUser) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser({
        name: user.displayName || "User",
        email: user.email,
        uid: user.uid,
      });
    } else {
      setUser(null);
    }
  });
};